import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import expresshbs from 'express-handlebars';
import {Server} from 'socket.io';

import TinNhan from './models/tinNhan.js';
import NguoiDung from './models/nguoiDung.js';
import ThongBao from './models/thongBao.js';
import BaiViet from './models/baiViet.js';

import nguoiDungRouter from './routers/nguoiDungRouter.js';
import matHangRouter from './routers/matHangRouter.js';
import tinNhanRouter from './routers/tinNhanRouter.js';
import baiVietRouter from './routers/baiVietRouter.js';
import binhLuanRouter from './routers/binhLuanRouter.js';
import thongBaoRouter from './routers/thongBaoRouter.js';
import layoutRouter from './routers/layoutRouter.js';

const PORT = process.env.PORT || 5000;

const app = express();

const databaseURL =
'mongodb+srv://nhannbt:thanhnhan-6@nhannbt.6gzgv.mongodb.net/dbSafaco?retryWrites=true&w=majority';

app.engine(
  '.hbs',
  expresshbs({
    helpers: {
      inc: function (value, options) {
        return parseInt(value) + 1;
      },
    },
  })
);
app.set('view engine', '.hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//cài đặt điều hướng
app.use('/nguoiDung/', nguoiDungRouter);
app.use('/matHang', matHangRouter);
app.use('/tinNhan/', tinNhanRouter);
app.use('/baiViet/', baiVietRouter);
app.use('/binhLuan/', binhLuanRouter);
app.use('/thongBao/', thongBaoRouter);
app.use('/layout', layoutRouter);

app.get('/', (req, res) => {
  res.send('Server đã sẵn sàng');
});
//kết nối đến database
mongoose
  .connect(databaseURL, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Đã kết nối đến MongoDb');
  })
  .catch((error) => {
    console.log('Lỗi kết nối đến database\n' + error);
  });

//socket.io
const server = app.listen(PORT, () => {
  console.log(`Đang chạy trên port ${PORT}`);
});

const io = new Server(server);
io.on('connection', (socket) => {
  console.log(`connect ${socket.id}`);
  socket.on('testab', (hihi) => {
    
  });

 
  const changeStream = TinNhan.watch([{$match: {operationType: 'insert'}}]);
  changeStream.on('change', (change) => {
    

    TinNhan.findOne({_id: change.fullDocument._id})
      .populate('idNguoiGui idNguoiNhan')
      .then((rs) => {
          io.emit('tinNhan', rs);    
      });
  });

  ThongBao.watch([{$match: {operationType: 'insert'}}]).on(
    'change',
    (change) => {
      

      ThongBao.findOne({_id: change.fullDocument._id})
        .populate('idNguoiDung')
        .then((rs) => {
          if (rs.loaiThongBao === 'baoCaoBaiViet') {
            const tb = new ThongBao({
              idNguoiDung: rs.idNguoiDung,
              idTruyXuat: rs.idTruyXuat,
              loaiThongBao: 'baiViet',
              noiDung:
                'Cảm ơn bạn đã báo cáo bài viết !\nNếu bài viết này vi phạm chúng tôi sẽ xử lý !',
            });
            tb.save();
              io.emit('thongBaoMoi', tb);
            
          } else {
              io.emit('thongBaoMoi', rs);
          }
        });
    }
  );

  socket.on('disconnect', () => {
    console.log(`disconnect ${socket.id}`);
  });
});
