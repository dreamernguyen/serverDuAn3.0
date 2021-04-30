import mongoose from 'mongoose';

const thongBaoSchema = mongoose.Schema(
  {
    idNguoiDung: { type: mongoose.Schema.Types.ObjectId, ref: 'NguoiDung' },
    idTruyXuat: {type: mongoose.Schema.Types.ObjectId},
    loaiThongBao : {type : String},
    noiDung : {type : String}
  },
  {
    timestamps: {
      createdAt: 'thoiGianTao',
      updatedAt: 'thoiGianCapNhat',
    },
  }
);

const ThongBao = mongoose.model('ThongBao', thongBaoSchema, 'thongBao');

export default ThongBao;
