import MatHang from "../models/matHang.js";
import NguoiDung from "../models/nguoiDung.js";
import ThongBao from "../models/thongBao.js";
export async function themMatHang(req, res) {
  try {
    const matHang = new MatHang({
      linkAnh: req.body.linkAnh,
      hangMuc: req.body.hangMuc,
      tieuDe: req.body.tieuDe,
      giaBan: req.body.giaBan,
      diaChi: req.body.diaChi,
      moTa: req.body.moTa,
      idNguoiDung: req.params.id,
    });
    const nguoiDung = await NguoiDung.findById(req.params.id);
    if (nguoiDung) {
        await matHang.save();
        res.send({
          thongBao: "Đã đăng hàng thành công",
        });
    } else {
      res.send({
        thongBao: "Không tìm thấy người dùng",
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi thêm mặt hàng ! \nChi tiết lỗi : ${error}`);
  }
}
export async function xoaMatHang(req, res) {
  try {
    const matHang = await MatHang.findById(req.params.id);
    if (matHang) {
      await MatHang.updateOne(
        { _id: req.params.id },
        {
          $set: {
            daXoa: true,
          },
        }
      );
      res.send({
        thongBao: `Xóa mặt hàng thành công !`,
      });
    } else {
      res.send({ thongBao: "Không tìm thấy mặt hàng !" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi xóa mặt hàng \nChi tiết lỗi : ${error}`);
  }
}
export async function chinhSuaMatHang(req, res) {
  try {
    const matHang = await MatHang.findById(req.params.id);
    if (!matHang) {
      res.send({
        thongBao: "Mặt hàng không tồn tại",
      });
    } else {
      const matHang2 = {
        $set: {
          hangMuc: req.body.hangMuc,
          moTa: req.body.moTa,
          giaBan: req.body.giaBan,
          tieuDe: req.body.tieuDe,
          linkAnh: req.body.linkAnh,
          diaChi : req.body.diaChi,
          daDuyet: false,
        },
      };
      await MatHang.updateOne({ _id: req.params.id }, matHang2);
      res.send({
        thongBao: "Cập nhật mặt hàng thành công",
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi cập nhật mặt hàng ! \nChi tiết lỗi : ${error}`);
  }
}
export async function danhSachMatHang(req, res) {
  try {
    await MatHang.find({ daDuyet: true, daXoa: false })
      .populate("idNguoiDung nguoiQuanTam").sort({thoiGianTao : -1})
      .then((danhSachMatHang) => {
        res.send({
          danhSachMatHang: danhSachMatHang,
        });
      });
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi load danh sách mặt hàng ! \nChi tiết lỗi : ${error}`);
  }

}
export async function matHangChiTiet(req, res) {
  try {
    const matHang = await MatHang.findById(req.params.id).populate(
      "idNguoiDung nguoiQuanTam"
    );
    if (!matHang) {
      res.send({
        thongBao: "Mặt hàng không tồn tại",
      });
    } else {
      res.send({
        matHang: matHang,
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi load mặt hàng chi tiết! \nChi tiết lỗi : ${error}`);
  }
}
export async function danhSachToiBan(req, res) {
  try {
    const danhSachMatHang = await MatHang.find({
      idNguoiDung: req.params.id, daXoa: false
    }).populate("idNguoiDung nguoiQuanTam").sort({thoiGianTao : -1});
    res.send({
      danhSachMatHang: danhSachMatHang,
    });
  } catch (error) {
    console.error(error);
    throw new Error(`Lỗi load danh sách ! \nChi tiết lỗi : ${error}`);
  }
}
export async function timKiem(req, res) {
  try {
    const hangMuc = req.body.hangMuc;
    const tieuDe = req.body.tieuDe;
    const diaChi = req.body.diaChi;
    const sapXepGiaBan = req.body.sapXepGiaBan;
    const sapXepThoiGian = req.body.sapXepThoiGian;
    await MatHang.find({
      daXoa: false,
      daDuyet:true,
      hangMuc: { $regex: hangMuc, $options: "i" },
      tieuDe: { $regex: tieuDe, $options: "i" },
      diaChi: { $regex: diaChi, $options: "i" },
    })
      .sort({ thoiGianTao: sapXepThoiGian })
      .populate("idNguoiDung nguoiQuanTam")
      .then((result) => {
        if (sapXepGiaBan == 1) {
          result.sort(function name(a, b) {
            return a.giaBan - b.giaBan;
          });
        } else if (sapXepGiaBan == -1) {
          result.sort(function name(a, b) {
            return b.giaBan - a.giaBan;
          });
        }
        res.send({
          thongBao: `Kết quả tìm kiếm với hạng mục : ${hangMuc}, tiêu đề : ${tieuDe}, địa chỉ : ${diaChi} , sapXepGiaBan : ${sapXepGiaBan},sapXepThoiGian : ${sapXepThoiGian}`,
          danhSachMatHang: result,
        });
      });
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi load danh sách ! \nChi tiết lỗi : ${error}`);
  }
}

export async function quanTam(req, res) {
  try {
    const nguoiDung = await NguoiDung.findById(req.body.idNguoiDung);
    const matHang = await MatHang.findById(req.body.idMatHang);
    if (matHang) {
      if (nguoiDung) {
        await MatHang.updateOne(
          { _id: matHang._id },
          { $push: { nguoiQuanTam: nguoiDung } }
        )
          .exec()
          .then((bv) => {
            res.send({
              thongBao: `Quan tâm mặt hàng thành công !`,
            });
              const thongBaoMoi = new ThongBao({
                idNguoiDung: matHang.idNguoiDung,
                idTruyXuat: matHang._id,
                loaiThongBao: "MatHang",
                noiDung: `${nguoiDung.hoTen} quan tâm đến mặt hàng của bạn`,
              });
              thongBaoMoi.save();
            
          });
      } else {
        res.send({ thongBao: "Không tìm thấy người dùng" });
      }
    } else {
      res.send({ thongBao: "Không tìm thấy mặt hàng" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Quan tâm mặt hàng thất bại ! \nChi tiết lỗi : ${error}`);
  }
}
export async function danhSachQuanTam(req, res) {
  try {
    const nguoiDung = await NguoiDung.findById(req.params.id);
    console.log(req.params.id);
    if (nguoiDung) {
      const rs = await MatHang.find({
        nguoiQuanTam: { $all: nguoiDung._id },
        // daDuyet: true,
        // daXoa: false,
      }).populate("idNguoiDung nguoiQuanTam");
      if (rs.length > 0) {
        res.send({ danhSachMatHang: rs });

      } else {
        res.send({
          thongBao: `Chưa quan tâm đến mặt hàng nào `,
          danhSachMatHang: [],
        });
      }
    } else {
      res.send({ thongBao: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi lấy mặt hàng quan tâm ! \nChi tiết lỗi : ${error}`);
  }
}
export async function boQuanTam(req, res) {
  try {
    const nguoiDung = await NguoiDung.findById(req.body.idNguoiDung);
    const matHang = await MatHang.findById(req.body.idMatHang);
    if (matHang) {
      if (nguoiDung) {
        await MatHang.updateOne(
          { _id: matHang._id },
          { $pull: { nguoiQuanTam: nguoiDung._id } }
        )
          .exec()
          .then((bv) => {
            res.send({
              thongBao: `Bỏ quan tâm mặt hàng thành công`,
            });
          });
      } else {
        res.send({ thongBao: "Không tìm thấy người dùng" });
      }
    } else {
      res.send({ thongBao: "Không tìm thấy mặt hàng" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Bỏ quan tâm mặt hàng thất bại ! \nChi tiết lỗi : ${error}`);
  }
}
export async function baoCaoMatHang(req, res) {
  try {
    const idMatHang = req.body.idMatHang;
    const idNguoiBaoCao = await NguoiDung.findById(req.body.idNguoiBaoCao);
    const noiDungBaoCao = req.body.noiDungBaoCao;
    const matHang = await MatHang.findById({_id: idMatHang});
    if (matHang) {
      if (matHang.baoCao > 3) {
        await MatHang.updateOne({_id: idMatHang}, {$inc: {baoCao: 1}, daXoa: true});
        const thongBaoUser1 = new ThongBao({
          idNguoiDung: matHang.idNguoiDung,
          idTruyXuat: idMatHang,
          loaiThongBao: 'MatHang',
          noiDung: `Mặt hàng ${matHang.tieuDe} của bạn đã bị khóa`,
        });
        const thongBaoUser2 = new ThongBao({
          idNguoiDung: idNguoiBaoCao,
          idTruyXuat: idNguoiBaoCao,
          loaiThongBao: 'PhanHoiBaoCao',
          noiDung: `Cảm ơn bạn đã báo cáo mặt hàng này`,
        });
        await thongBaoUser2.save();
        await thongBaoUser1.save();
        res.send({
          thongBao: `Mặt hàng ${matHang.tieuDe} đã bị khóa`,
        });
      } else {
        await MatHang.updateOne({_id: idMatHang}, {$inc: {baoCao: 1}});
        const thongBaoUser2 = new ThongBao({
          idNguoiDung: idNguoiBaoCao,
          idTruyXuat: idNguoiBaoCao,
          loaiThongBao: 'PhanHoiBaoCao',
          noiDung: `Cảm ơn bạn đã báo cáo mặt hàng này`,
        });
        const thongBaoAdmin = new ThongBao({
          idNguoiDung: idNguoiBaoCao,
          idTruyXuat: matHang._id,
          loaiThongBao: 'BaoCaoMatHang',
          noiDung: noiDungBaoCao,
        });
        await thongBaoUser2.save();
        await thongBaoAdmin.save();
        res.send({
          thongBao: `Đã báo cáo mặt hàng ${matHang.tieuDe}`,
        });
      }
    } else {
      res.send({ thongBao: "Không tìm thấy mặt hàng này"})
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Báo cáo mặt hàng thất bại \n Lỗi chi tiết: ${error}`);
  }
}
