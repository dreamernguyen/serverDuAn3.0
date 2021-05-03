import NguoiDung from "../models/nguoiDung.js";
import BaiViet from "../models/baiViet.js";
import ThongBao from '../models/thongBao.js';

export async function dangKy(req, res) {
  const nguoiDungMoi = new NguoiDung(req.body);
  try {
    if (await NguoiDung.findOne({ soDienThoai: req.body.soDienThoai })) {
      res.send({
        thongBao: "Số điện thoại này đã được đăng ký",
      });
    } else {
      await nguoiDungMoi.save();
      res.send({
        thongBao: `Đăng ký thành công với số điện thoại ${req.body.soDienThoai}`,
      });
      const thongBaoMoi = new ThongBao({
        idNguoiDung: nguoiDungMoi._id,
        idTruyXuat: nguoiDungMoi._id,
        loaiThongBao: "NguoiDung",
        noiDung: "Chào mừng bạn đến với mạng xã hội Safaco",
      });
      thongBaoMoi.save();
    }
  } catch (err) {
    console.log(err);
    throw new Error(`Lỗi đăng ký ! \nChi tiết lỗi : ${err}`);
  }
}
export async function dangNhapBangSoDienThoai(req, res) {
  const { soDienThoai, matKhau } = req.body;
  try {
    const nguoiDung = await NguoiDung.findOne({soDienThoai: soDienThoai});
    if (nguoiDung) {
      if (matKhau == nguoiDung.matKhau) {
        res.send({
          thongBao: "Đăng nhập thành công !",
          nguoiDung: nguoiDung,
        });
      } else if (matKhau != nguoiDung.matKhau) {
        res.send({
          thongBao: "Sai mật khẩu !",
        });
      }
    } else {
      res.send({
        thongBao: "Tài khoản không tồn tại !",
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error(`Đăng nhập thất bại ! \nChi tiết lỗi : ${err}`);
  }
}
export async function dangNhapBangGoogle(req, res) {
  const email = req.body.email;
  const nguoiDungMoi = new NguoiDung(req.body);
  try {
    const nguoiDung = await NguoiDung.findOne({ email: email });
    if (nguoiDung) {
      res.send({
        thongBao: "Email này đã được liên kết !",
        nguoiDung: nguoiDung,
      });
    } else {
      nguoiDungMoi.save();
      res.send({
        thongBao: "Email này chưa được liên kết !",
        nguoiDung: nguoiDungMoi,
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error(`Đăng nhập Google thất bại ! \nChi tiết lỗi : ${err}`);
  }
}
export async function danhSachNguoiDung(req, res) {
  await NguoiDung.find()
    .then((list) => {
      if (list.length > 0) {
        res.send({ danhSachNguoiDung: list });
      } else {
        res.send(
          {thongBao: 'Danh sách người dùng trống !', danhSachNguoiDung: []}
        );
      }
    })
    .catch((err) => {
      console.log(err);
      throw new Error(`Lỗi lấy danh sách người dùng !\nChi tiết lỗi ${err}`);
    });
}
export async function xemTrangCaNhan(req, res) {
  try {
    const nguoiDung = await NguoiDung.findById(req.params.id);
    if (nguoiDung) {
      const danhSachBaiViet = await BaiViet.find({
        idNguoiDung: req.params.id,
        daAn: false,
        daXoa: false,
      }).populate("idNguoiDung luotThich");
       danhSachBaiViet.sort(function (a, b) {
         return b.thoiGianTao - a.thoiGianTao;
       });
      res.send({
        nguoiDung: nguoiDung,
        danhSachBaiViet: danhSachBaiViet,
      });
    } else {
      res.send({ thongBao: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi xem trang cá nhân !\nChi tiết lỗi ${error}`);
  }
}
export async function theoDoi(req, res) {
  try {
    const nguoiTheoDoi = await NguoiDung.findById(req.body.idNguoiTheoDoi);
    const nguoiDuocTheoDoi = await NguoiDung.findById(
      req.body.idNguoiDuocTheoDoi
    );
    if (nguoiTheoDoi) {
      if (nguoiDuocTheoDoi) {
         if(nguoiDuocTheoDoi.duocTheoDoi.includes(nguoiTheoDoi._id)){
            res.send({thongBao: "Đã theo dõi người này"});
         } else {
           await NguoiDung.updateOne(
             { _id: nguoiTheoDoi._id },
             { $push: { dangTheoDoi: nguoiDuocTheoDoi } }
           );
           await NguoiDung.updateOne(
             { _id: nguoiDuocTheoDoi._id },
             { $push: { duocTheoDoi: nguoiTheoDoi } }
           );
           res.send({ thongBao: `Theo dõi thành công ${nguoiDuocTheoDoi.hoTen}` });
           const thongBaoMoi = new ThongBao({
             idNguoiDung: nguoiDuocTheoDoi._id,
             idTruyXuat: nguoiTheoDoi._id,
             loaiThongBao: 'NguoiDung',
             noiDung: `${nguoiTheoDoi.hoTen} bắt đầu theo dõi bạn`,
           });
           thongBaoMoi.save();
         }
      } else {
        res.send({ thongBao: "Không tìm thấy người được theo dõi" });
      }
    } else {
      res.send({ thongBao: "Không tìm thấy người theo dõi" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Theo dõi thất bại !\nChi tiết lỗi ${error}`);
  }
}
export async function huyTheoDoi(req, res) {
  try {
    const nguoiTheoDoi = await NguoiDung.findById(req.body.idNguoiTheoDoi);
    const nguoiDuocTheoDoi = await NguoiDung.findById(
      req.body.idNguoiDuocTheoDoi
    );
    if (nguoiTheoDoi) {
      if (nguoiDuocTheoDoi) {
        await NguoiDung.updateOne(
          { _id: nguoiTheoDoi._id },
          { $pull: { dangTheoDoi: nguoiDuocTheoDoi._id } }
        );
        await NguoiDung.updateOne(
          { _id: nguoiDuocTheoDoi._id },
          { $pull: { duocTheoDoi: nguoiTheoDoi._id } }
        );
        res.send({
          thongBao: `Hủy theo dõi thành công ${nguoiDuocTheoDoi.hoTen}`,
        });
      } else {
        res.send({ thongBao: "Không tìm thấy người được theo dõi" });
      }
    } else {
      res.send({ thongBao: "Không tìm thấy người theo dõi" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Hủy theo dõi thất bại !\nChi tiết lỗi ${error}`);
  }
}
export async function chinhSuaThongTin(req, res) {
  try {
    const nguoiDung = await NguoiDung.findById(req.params.id);
    if (!nguoiDung) {
      res.send({
        thongBao: "Người dùng không tồn tại !",
      });
    } else {
      const capNhat = {
        $set: {
          hoTen: req.body.hoTen,
          tieuSu: req.body.tieuSu,
          ngaySinh: req.body.ngaySinh,
          gioiTinh: req.body.gioiTinh,
          diaChi: req.body.diaChi,
        },
      };
      await NguoiDung.updateOne({ _id: req.params.id }, capNhat);
      res.send({
        thongBao: "Cập nhật người dùng thành công !",
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Cập nhật người dùng thất bại ! \nChi tiết lỗi : ${error}`);
  }
}
export async function doiMatKhau(req, res) {
  try {
    const matKhauCu = req.body.matKhauCu;
    const matKhauMoi = req.body.matKhauMoi;
    const nguoiDung = await NguoiDung.findById(req.params.id);
    if (!nguoiDung) {
      res.send({
        thongBao: "Người dùng không tồn tại !",
      });
    } else {
      if(matKhauCu === nguoiDung.matKhau){
        await NguoiDung.updateOne(
          { _id: req.params.id },
          {
            $set: {
              matKhau: matKhauMoi,
            },
          }
        );
        res.send({
          thongBao: "Đổi mật khẩu thành công !",
        });
      }else{
        res.send({
          thongBao: "Mật khẩu cũ không trùng khớp !",
        });
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Đổi mật khẩu thất bại ! \nChi tiết lỗi : ${error}`);
  }
}
export async function doiAvatar(req, res) {
  try {
    const avatarMoi = req.body.linkAnh;
    const nguoiDung = await NguoiDung.findById(req.params.id)
    if(nguoiDung){
      await NguoiDung.updateOne({_id: req.params.id}, {avatar: avatarMoi});
      res.send({
        thongBao: "Cập nhật avatar thành công",
         nguoiDung: nguoiDung
        })
    } else {
      res.send({thongBao: "Người dùng không tồn tại"})
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Cập nhật avatar thất bại ! \nChi tiết lỗi: ${error}`);
  }
}
export async function xemNguoiTheoDoi(req, res) {
  try {
    const nguoiDung = await NguoiDung.findById(req.params.id).populate(
      'dangTheoDoi duocTheoDoi'
    );
    if (nguoiDung) {
      res.send({
        dangTheoDoi: nguoiDung.dangTheoDoi,
        duocTheoDoi: nguoiDung.duocTheoDoi,
      });
    } else {
      res.send({thongBao: 'Không tìm thấy người dùng'});
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi xem người theo dõi !\nChi tiết lỗi ${error}`);
  }
}
export async function nguoiDungChiTiet(req, res) {
  try {
    const nguoiDung = await NguoiDung.findById(req.params.id);
    if (nguoiDung) {
      res.send({
        nguoiDung: nguoiDung,
      });
    } else {
      res.send({ thongBao: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi người dùng chi tiết !\nChi tiết lỗi ${error}`);
  }
}
export async function checkSoDienThoai(req, res) {
  try {
    const nguoiDung = await NguoiDung.findOne({
      soDienThoai: req.params.soDienThoai,
    });
    if (nguoiDung) {
      res.send({
        thongBao: 'Số điện thoại này đã được đăng ký',
      });
    } else {
      res.send({
        thongBao: 'Số điện thoại chưa đăng ký',
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error(`Lỗi check số điện thoại ! \nChi tiết lỗi : ${err}`);
  }
}
export async function themSoDienThoai(req, res) {
  try {
    const soDienThoai = req.body.soDienThoai;
    const nguoiDung = await NguoiDung.findById(req.params.id);
    if (!nguoiDung) {
      res.send({
        thongBao: "Người dùng không tồn tại !",
      });
    } else {
      await NguoiDung.updateOne(
        { _id: req.params.id },
        {
          $set: {
            soDienThoai : soDienThoai
          },
        }
      );
      res.send({
        thongBao: "Thêm số điện thoại thành công !",
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Thêm số điện thoại thất bại ! \nChi tiết lỗi : ${error}`);
  }
}
export async function quenMatKhau(req, res){
  try {
    const soDienThoai = req.body.soDienThoai;
    const matKhauMoi = req.body.matKhauMoi;
    const nguoiDung = await NguoiDung.findOne({soDienThoai : soDienThoai});
     if (!nguoiDung) {
      res.send({
        thongBao: "Người dùng không tồn tại !",
      });
    } else {
      await NguoiDung.updateOne(
        { soDienThoai: soDienThoai },
        {
          $set: {
            matKhau : matKhauMoi
          },
        }
      );
      res.send({
        thongBao: "Lấy lại mật khẩu thành công !",
      });
    }
  
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi cập nhật mật khẩu \n Lỗi chi tiết ${error}`);
  }
}
