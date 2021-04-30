import TinNhan from "../models/tinNhan.js";
import NguoiDung from "../models/nguoiDung.js";
import mongoose from "mongoose";

export async function nhanTin(req, res) {
  try {
    const nguoiGui = await NguoiDung.findById(req.body.idNguoiGui);
    const nguoiNhan = await NguoiDung.findById(req.body.idNguoiNhan);
    if (nguoiGui) {
      if (nguoiNhan) {
        const tinNhan = new TinNhan(req.body);
        await tinNhan.save();
        res.send({ thongBao: "Đã tạo tin nhắn mới" });
      } else {
        res.send({ thongBao: "Không tìm thấy người nhận" });
      }
    } else {
      res.send({ thongBao: "Không tìm thấy người gửi" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Nhắn tin không thành công ! \nChi tiết lỗi : ${error}`);
  }
}
export async function danhSachTinNhan(req, res) {
  await TinNhan.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(`Lỗi lấy danh sách tin nhắn ${err}`);
    });
}

export async function danhSachLienHe(req, res) {
  const idNguoiDung = mongoose.Types.ObjectId(req.params.id);
  await TinNhan.find({
    $or: [{ idNguoiGui: idNguoiDung }, { idNguoiNhan: idNguoiDung }],
  })
    .select("idNguoiNhan idNguoiGui")
    .sort({thoiGianGui : -1})
    .populate("idNguoiNhan idNguoiGui", "hoTen avatar")
    .then((result) => {
      var mang = [];
      result.forEach((element) => {
        if (!mang.includes(element.idNguoiGui)) {
          mang = mang.concat(element.idNguoiGui);
          if (!mang.includes(element.idNguoiNhan)) {
            mang = mang.concat(element.idNguoiNhan);
          }
        }
      });
      var b = Array.from(new Set(mang.map(JSON.stringify)));
      let mangCuoi = b.map((i) => {
        return JSON.parse(i);
      });
      mangCuoi.forEach((value, index) => {
        value._id == idNguoiDung ? mangCuoi.splice(index, 1) : null;
      });
      mangCuoi.sort(function (a, b) {
        return b.thoiGianTao - a.thoiGianTao;
      });
      res.send(mangCuoi);
    })
    .catch((err) => {
      console.log(err);
      throw new Error(`Lỗi load danh sách liên hệ ! \nChi tiết lỗi : ${err}`);
    });
}
export async function cuocTroChuyen(req, res) {
  try {
    const idNguoi1 = req.body.idNguoi1;
    const idNguoi2 = req.body.idNguoi2;
    const a = {
      $and: [
        { $or: [{ idNguoiGui: idNguoi1 }, { idNguoiNhan: idNguoi1 }] },
        { $or: [{ idNguoiGui: idNguoi2 }, { idNguoiNhan: idNguoi2 }] },
      ],
    };
    await TinNhan.find(a)
      .populate("idNguoiNhan idNguoiGui")
      .then((rs) => {
                var tinNhanDaLoc = rs.filter(function (tinNhan) {
          return !tinNhan.xoaTinVoi.includes(idNguoi1);
        });
        res.send(tinNhanDaLoc);
      });
  } catch (error) {
    console.log(error)
    throw new Error(`Lỗi load cuộc trò chuyện ! \nChi tiết lỗi : ${error}`);
  }
}

export async function xoaToanBoCuocTroChuyen(req, res) {
  try {
    const idNguoi1 = req.params.idNguoiDung;
    const a = {
      $or: [{ idNguoiGui: idNguoi1 }, { idNguoiNhan: idNguoi1 }],
    };
    await TinNhan.updateMany(a, { $push: { xoaTinVoi: idNguoi1 } }).then(
      (rs) => {
        res.send({thongBao : 'Đã xóa toàn bộ cuộc trò chuyện'});
      }
    );
  } catch (error) {
    console.log(error)
    throw new Error(`Lỗi xóa toàn bộ cuộc trò chuyện ! \nChi tiết lỗi : ${error}`);

  }
}
export async function xoaTinNhan(req, res) {
  try {
  const id = req.params.id;
  const idNguoiAn = req.body.idNguoiDung;

  await TinNhan.updateOne({ _id: id }, { $push: { xoaTinVoi: idNguoiAn } }).then(
    (rs) => {
      res.send({thongBao : 'Đã xóa tin nhắn'});
    }      
  );
  } catch (error) {
    console.log(error)
    throw new Error(`Lỗi xóa tin nhắn ${error}`);
  }            
} 