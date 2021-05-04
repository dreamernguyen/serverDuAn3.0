import BaiViet from "../models/baiViet.js";
import NguoiDung from "../models/nguoiDung.js";
import ThongBao from "../models/thongBao.js";
export async function dangBai(req, res) {
  try {
    const baiVietMoi = new BaiViet({
      noiDung: req.body.noiDung,
      linkAnh: req.body.linkAnh,
      idNguoiDung: req.params.id,
    });
    const nguoiDung = await NguoiDung.findById(req.params.id);
    if (nguoiDung) {
      await baiVietMoi.save();
      res.send({
        thongBao: "Đăng bài viết thành công",
      });
    } else {
      res.send({
        thongBao: "Không tìm thấy người dùng",
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Đăng bài thất bại ! \nChi tiết lỗi : ${error}`);
  }
}
export async function danhSachBaiViet(req, res) {
  try {
    const list = await BaiViet.find({
      daAn: false,
      daXoa: false,
    }).populate("idNguoiDung luotThich");
    if (list.length <= 0) {
      res.send({
        thongBao: "Danh sách bài viết trống !",
        danhSachBaiViet: []
      });
    } else {
      res.send({ danhSachBaiViet: list});
    }
  } catch (error) {
    console.log(error);
    throw new Error(
      `Lấy danh sách bài viết thất bại ! \nChi tiết lỗi : ${error}`
    );
  }
}
export async function danhSachBaiVietDangTheoDoi(req, res) {
  try {
    const nguoiDung = await NguoiDung.findById(req.params.id);
    if (nguoiDung != null) {
      const dangTheoDoi = nguoiDung.dangTheoDoi;
      if (dangTheoDoi.length > 0) {
        var mang = [];
        for (let index = 0; index < dangTheoDoi.length; index++) {
          const element = dangTheoDoi[index];
          const dsBaiViet = await BaiViet.find({
            idNguoiDung: element,
            daAn: false,
            daXoa: false,
          }).populate("idNguoiDung luotThich");
          mang = mang.concat(dsBaiViet);
        }
        mang.sort(function (a, b) {
          return b.thoiGianTao - a.thoiGianTao;
        });
        res.send({ danhSachBaiViet: mang });
      } else {
        res.send({ danhSachBaiViet: [], nguoiDung: nguoiDung });
      }
    } else {
      res.send({ thongBao: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(
      `Lỗi danh sách bài viết theo dõi \nChi tiết lỗi : ${error}`
    );
  }
}
export async function xoaBaiViet(req, res) {
  try {
    const baiViet = await BaiViet.findById(req.params.id);
    if (baiViet) {
      await BaiViet.findByIdAndDelete({ _id: req.params.id });
      res.send({
        thongBao: `Xóa bài viết thành công !`,
      });
    } else {
      res.send({ thongBao: "Không tìm thấy bài viết !" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi xóa bài viết \nChi tiết lỗi : ${error}`);
  }
}
export async function anBaiViet(req, res) {
  try {
    const baiViet = await BaiViet.findById(req.params.id);
    if (baiViet) {
      const anBai = {
        $set: {
          daAn: true,
        },
      };
      await BaiViet.updateOne({ _id: req.params.id }, anBai);
      res.send({
        thongBao: `Ẩn bài viết thành công !`,
      });
    } else {
      res.send({ thongBao: "Không tìm thấy bài viết !" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi ẩn bài viết \nChi tiết lỗi : ${error}`);
  }
}
export async function danhSachBaiVietAnCuaToi(req, res) {
  try {
    const danhSachBaiVietAn = await BaiViet.find({idNguoiDung: req.params.id, daAn: true}).populate("idNguoiDung luotThich")
    if (danhSachBaiVietAn.length > 0) {
      res.send({danhSachBaiViet: danhSachBaiVietAn});
      console.log(danhSachBaiVietAn);
    } else {
      res.send({
        thongBao: "Không có bài viết ẩn nào",
        danhSachBaiViet: []
      })
    }
  } catch (error) {
    console.log(error)
    throw new Error(`Lỗi danh sách bài viết ẩn \n Lỗi chi tiết ${error}`)
  }
}
export async function huyAnBaiViet(req, res) {
  try {
    const baiViet = await BaiViet.findById(req.params.id);
    if (baiViet) {
      const baiViet2 = {
        $set: {
          anBaiViet: false,
        },
      };
      await BaiViet.updateOne({ _id: req.params.id }, baiViet2);
      res.send({
        thongBao: `Hủy ẩn bài viết thành công !`,
      });
    } else {
      res.send({ thongBao: "Không tìm thấy bài viết" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi hủy ẩn bài viết \nChi tiết lỗi ${error}`);
  }
}
export async function chiTietBaiViet(req, res) {
  try {
    const baiViet = await BaiViet.findById(req.params.id).populate(
      "idNguoiDung luotThich"
    );
    if (baiViet) {
      res.send({
        baiViet: baiViet,
      });
    } else {
      res.send({ thongBao: "Không tìm thấy bài viết !" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi xem bài viết chi tiết ! \nChi tiết lỗi : ${error}`);
  }
}
export async function chinhSuaBaiViet(req, res) {
  try {
    const baiViet = await BaiViet.findById(req.params.id);
    if (!baiViet) {
      res.send({
        thongBao: "Bài viết không tồn tại !",
      });
    } else {
      const capNhat = {
        $set: {
          linkAnh: req.body.linkAnh,
          noiDung: req.body.noiDung,
        },
      };
      await BaiViet.updateOne({ _id: req.params.id }, capNhat);
      res.send({
        thongBao: "Cập nhật bài viết thành công !",
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Cập nhật bài viết thất bại ! \nChi tiết lỗi : ${error}`);
  }
}
export async function thichBaiViet(req, res) {
  try {
    const nguoiDung = await NguoiDung.findById(req.body.idNguoiDung);
    const baiViet = await BaiViet.findById(req.body.idBaiViet);
    if (baiViet) {
      if (nguoiDung) {
        await BaiViet.updateOne(
          { _id: baiViet._id },
          { $push: { luotThich: nguoiDung } }
        )
          .exec()
          .then((bv) => {
            res.send({
              thongBao: `Thích bài viết thành công !`,
            });
            if (String(baiViet.idNguoiDung) !== String(nguoiDung._id)) {
              const thongBaoMoi = new ThongBao({
                idNguoiDung: baiViet.idNguoiDung,
                idTruyXuat: baiViet._id,
                loaiThongBao: 'BaiViet',
                noiDung: `${nguoiDung.hoTen} vừa thích bài viết của bạn`,
              });
              thongBaoMoi.save();
            }
          });
      } else {
        res.send({ thongBao: "Không tìm thấy người dùng" });
      }
    } else {
      res.send({ thongBao: "Không tìm thấy bài viết" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Thích bài viết thất bại ! \nChi tiết lỗi : ${error}`);
  }
}
export async function boThichBaiViet(req, res) {
  try {
    const nguoiDung = await NguoiDung.findById(req.body.idNguoiDung);
    const baiViet = await BaiViet.findById(req.body.idBaiViet);
    if (baiViet) {
      if (nguoiDung) {
        await BaiViet.updateOne(
          { _id: baiViet._id },
          { $pull: { luotThich: nguoiDung._id } }
        )
          .exec()
          .then((bv) => {
            res.send({
              thongBao: `Bỏ thích bài viết thành công`,
            });
          });
      } else {
        res.send({ thongBao: "Không tìm thấy người dùng" });
      }
    } else {
      res.send({ thongBao: "Không tìm thấy bài viết" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Bỏ thích bài viết thất bại ! \nChi tiết lỗi : ${error}`);
  }
}
export async function anKhoiToi(req, res) {
  try {
    const idBaiViet = await BaiViet.findById(req.body.idBaiViet);
    const idNguoiAn = await NguoiDung.findById(req.body.idNguoiDung);

    await BaiViet.updateOne(
      { _id: idBaiViet._id },
      { $push: { anBaiVoi: idNguoiAn._id } }
    ).then((rs) => {
      res.send({ thongBao: "Đã ẩn bài viết này khỏi bạn" });
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Ẩn bài thất bại ! \nChi tiết lỗi : ${error}`);
  }
}
export async function baoCaoBaiViet(req, res) {
  try {
    const idBaiViet = req.body.idBaiViet;
    const idNguoiBaoCao = req.body.idNguoiDung;
    const noiDungBaoCao = req.body.noiDungBaoCao;

    const baiViet = await BaiViet.findById(idBaiViet);
    const nguoiBaoCao = await NguoiDung.findById(idNguoiBaoCao);
    if (baiViet) {
      if (baiViet.baoCao > 2) {
        await BaiViet.updateOne(
          {_id: baiViet._id},
          {$inc: {baoCao: 1}, daXoa: true}
        );
        const thongBaoUser1 = new ThongBao({
          idNguoiDung: baiViet.idNguoiDung,
          idTruyXuat: idBaiViet,
          loaiThongBao: 'BaiViet',
          noiDung: `Bài viết ${baiViet.noiDung} của bạn đã bị khóa`,
        });
        const thongBaoUser2 = new ThongBao({
          idNguoiDung: idNguoiBaoCao,
          idTruyXuat: idNguoiBaoCao,
          loaiThongBao: 'PhanHoiBaoCao',
          noiDung: `Cảm ơn bạn đã báo cáo bài viết này`,
        });
        await thongBaoUser2.save();
        await thongBaoUser1.save();
      
      } else {
        await BaiViet.updateOne(
          {_id: idBaiViet},
          {
            $push: {anBaiVoi: idNguoiBaoCao},
            $inc: {baoCao: 1},
          }
        );
        if (nguoiBaoCao) {
          const thongBaoAdmin = new ThongBao({
            idNguoiDung: nguoiBaoCao._id,
            idTruyXuat: baiViet._id,
            loaiThongBao: 'BaoCaoBaiViet',
            noiDung: noiDungBaoCao,
          });
          thongBaoAdmin.save();
          const thongBaoUser = new ThongBao({
            idNguoiDung: nguoiBaoCao._id,
            idTruyXuat: nguoiBaoCao._id,
            loaiThongBao: 'PhanHoiBaoCao',
            noiDung: `Cảm ơn bạn đã báo cáo bài viết!\nChúng tôi sẽ xử lý nếu bài viết vi phạm !`,
          });
          thongBaoUser.save();
        }
      }
      res.send({
        thongBao: `Báo cáo bài viết thành công !`,
      });
    } else {
      res.send({thongBao: 'Không tìm thấy bài viết !'});
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi báo cáo bài viết \nChi tiết lỗi : ${error}`);
  }
}
export async function danhSachBaiVietYeuThich(req, res) {
  try {
    const nguoiDung = await NguoiDung.findById(req.params.id);
    console.log(req.params.id);
    if (nguoiDung) {
      const rs = await BaiViet.find({
        luotThich: { $all: nguoiDung._id },
        daAn: false,
        daXoa: false,
      }).populate("idNguoiDung luotThich");
      if (rs.length > 0) {
        res.send({ danhSachBaiViet: rs });
      } else {
        res.send({
          thongBao: `Chưa yêu thích bài viết nào `,
          danhSachBaiViet: [],
        });
      }
    } else {
      res.send({ thongBao: "Không tìm thấy người dùng" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi lấy bài viết yêu thích ! \nChi tiết lỗi : ${error}`);
  }
}
