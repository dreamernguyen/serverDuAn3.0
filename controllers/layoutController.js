import BaiViet from '../models/baiViet.js';
import matHang from '../models/matHang.js';
import NguoiDung from '../models/nguoiDung.js';
import ThongBao from '../models/thongBao.js';
import TinNhan from '../models/tinNhan.js';
import BinhLuan from '../models/binhLuan.js';
//nguoiDung
//danh sách người dùng
export async function DSNguoiDung(req, res) {
  try {
    const DS = await NguoiDung.find();
    res.render('../views/nguoiDung.hbs', {
      thongBao: 'Danh sách người dung',
      DS: DS.map((DS) => DS.toJSON()),
    });
  } catch (error) {
    console.log(error);
  }
}
// người dùng chi tiết
export async function NguoiDungChiTiet(req, res) {
  try {
    const nguoiDung = await NguoiDung.findById(req.params.id);
    if (nguoiDung) {
      const dsBaiViet = await BaiViet.find({
        idNguoiDung: nguoiDung._id,
        daXoa: false,
      }).populate('idNguoiDung');
      const dsMatHang = await matHang
        .find({idNguoiDung: nguoiDung._id})
        .populate('idNguoiDung');
      const theoDoi = nguoiDung.dangTheoDoi;
      const duocTheoDoi = nguoiDung.duocTheoDoi;
      res.render('../views/nguoiDungChiTiet.hbs', {
        nguoiDung: nguoiDung.toJSON(),
        theoDoi: theoDoi.length,
        duocTheoDoi: duocTheoDoi.length,
        thoiGianTao:
          nguoiDung.thoiGianTao.toLocaleTimeString() +
          ' - ' +
          nguoiDung.thoiGianTao.toLocaleDateString(),
        dsBaiViet: dsBaiViet.map((dsbaiviet) => dsbaiviet.toJSON()),
        dsMatHang: dsMatHang.map((dsmathang) => dsmathang.toJSON()),
        thongBao: 'Thông tin người dùng',
      });
    }
  } catch (error) {
    console.log(error);
  }
}
export async function XoaNguoiDung(req, res) {
  const nguoiDung = await NguoiDung.findById(req.params.id);
  if (nguoiDung) {
    console.log(nguoiDung.hoTen);
    try {
      await BaiViet.deleteMany({idNguoiDung: nguoiDung._id});
      await matHang.deleteMany({idNguoiDung: nguoiDung._id});
      await NguoiDung.updateMany(
        {dangTheoDoi: {$all: nguoiDung._id}},
        {$pull: {dangTheoDoi: nguoiDung._id}}
      );
      await NguoiDung.updateMany(
        {duocTheoDoi: {$all: nguoiDung._id}},
        {$pull: {duocTheoDoi: nguoiDung._id}}
      );
      await TinNhan.deleteMany({idNguoiGui: nguoiDung._id});
      await TinNhan.deleteMany({idNguoiNhan: nguoiDung._id});
      await BinhLuan.deleteMany({idNguoiDung: nguoiDung._id});
      await NguoiDung.deleteOne({_id: nguoiDung._id});
      res.redirect('/layout/DSNguoiDung');
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status('người dùng không tồn tại');
  }
}
export async function TimKiemNguoiDung(req, res) {
  try {
    const hoTen = req.body.hoTen;
    const dsNguoiDung = await NguoiDung.find({hoTen: {$regex:hoTen, $options: "i"}});
    if(dsNguoiDung.length > 0) {
      res.render("../views/nguoiDung.hbs", {
        thongBao: "Danh sách tìm kiếm",
        DS: dsNguoiDung.map((danhsach) => danhsach.toJSON()),
    })
    } else {
      res.render("../views/nguoiDung.hbs", 
      {thongBao: "Không tìm thấy người dùng"}
      );
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi tìm kiếm người dùng \n Lỗi chi tiết ${error}`);
  }
}

//Bài Viết
//danh sách bài viết
export async function TrangChu(req, res) {
  try {
    const dsbaiViet = await BaiViet.find({daXoa: false}).populate(
      'idNguoiDung'
    );
    if (dsbaiViet) {
      dsbaiViet.sort(function (a, b) {
        return b.thoiGianTao - a.thoiGianTao;
      });
      res.render('../views/trangChu.hbs', {
        thongBao: 'Danh sách bài viết',
        baiViet: dsbaiViet.map((baiViet) => baiViet.toJSON()),
      });
    } else {
      res.send({thongBao: 'Danh sách bài viết trống'});
    }
  } catch (error) {
    console.log(error);
  }
}
// danh sách bài viết bị xóa
export async function BaiVietBiGo(req, res) {
  try {
    const dsbaiViet = await BaiViet.find({
      daXoa: true,
    }).populate('idNguoiDung','hoTen');
    if (dsbaiViet) {
      dsbaiViet.sort(function (a, b) {
        return b.thoiGianTao - a.thoiGianTao;
      });
      res.render('../views/trangChu.hbs', {
        thongBao: 'Danh sách bài viết bị xóa',
        baiViet: dsbaiViet.map((baiViet) => baiViet.toJSON()),
      });
    } else {
      res.render('../views/trangChu.hbs', {
        thongBao: 'Dang sách trống',
      });
    }
  } catch (error) {
    console.log(error);
  }
}
// xáo bài viết daXoa: true
export async function XoaBaiViet(req, res) {
  try {
    const baiViet = await BaiViet.findById(req.params.id);
    if (baiViet) {
      await BaiViet.updateOne({_id: req.params.id}, {daXoa: true});
      const thongBaoUser = new ThongBao({
        idNguoiDung: baiViet.idNguoiDung,
        idTruyXuat: baiViet._id,
        loaiThongBao: 'BaiViet',
        noiDung: `Bài viết của bạn đã bị xóa`,
      });
      thongBaoUser.save();
      res.redirect('/layout/trangChu');
    } else {
      res.send({thongBao: 'Error'});
    }
  } catch (error) {
    console.log(error);
  }
}
// khôi phục bài viết daXoa: false
export async function KhoiPhucBaiViet(req, res) {
  try {
    const baiViet = await BaiViet.findById(req.params.id);
    if (baiViet) {
      await BaiViet.updateOne({_id: req.params.id}, {daXoa: false, baoCao: 0});
      await ThongBao.deleteMany({loaiThongBao:"BaoCaoBaiViet", idTruyXuat: req.params.id});
      const thongBaoUser = new ThongBao({
        idNguoiDung: baiViet.idNguoiDung,
        idTruyXuat: baiViet._id,
        loaiThongBao: 'BaiViet',
        noiDung: `Bài viết của bạn đã được khôi phục`,
      });
      thongBaoUser.save();
      res.redirect('/layout/danhSachBaiVietDaXoa');
    } else {
      res.send({thongBao: 'Error'});
    }
  } catch (error) {
    console.log(error);
  }
}
// danh sách bài viết bị báo cáo
export async function BaiVietBiBaoCao(req, res) {
  try {
    const dsBaiViet = await BaiViet.find({
      baoCao: {$gt: 0},
      daXoa: false,
    }).populate('idNguoiDung');
    if (dsBaiViet) {
      res.render('../views/baiVietBiBaoCao.hbs', {
        thongBao: 'Danh sách bài viết bị báo cáo',
        dsBaiViet: dsBaiViet.map((dsbaiviet) => dsbaiviet.toJSON()),
      });
    } else {
      res.render('../views/baiVietBiBaoCao.hbs', {
        thongBao: 'Danh sách trống',
      });
    }
  } catch (error) {
    console.log(error);
  }
}
// bài viết chi tiết
export async function BaiVietChiTiet(req, res) {
  try {
    const dsBaoCao = await ThongBao.find({
      idTruyXuat: req.params.id,
      loaiThongBao: 'BaoCaoBaiViet',
    }).populate('idNguoiDung');
    const baiViet = await BaiViet.findById(req.params.id).populate(
      'idNguoiDung'
    );
    const binhLuan = await BinhLuan.find({idBaiViet: req.params.id});
    if (baiViet) {
      res.render('../views/baiVietChiTiet.hbs', {
        thongBao: 'Bài viết chi tiết',
        baiViet: baiViet.toJSON(),
        dsBaoCao: dsBaoCao.map((dsbaocao) => dsbaocao.toJSON()),
        dsBinhLuan: binhLuan.map((dsbinhluan) => dsbinhluan.toJSON()),
      });
    } else {
      res.send({thongBao: 'Không thấy bài viết'});
    }
  } catch (error) {
    console.log(error);
  }
}
// tim kiem 
export async function TimKiemBaiViet(req, res) {
  try {
    const noiDung = req.body.noiDung;
    const dsbaiViet = await BaiViet.find({noiDung: {$regex: noiDung, $options: "i"}, daXoa: false}).populate("idNguoiDung");
    if(dsbaiViet.length > 0){
      res.render('../views/trangChu.hbs', {
        baiViet: dsbaiViet.map((baiViet) => baiViet.toJSON()), 
        thongBao: 'Kết quản tìm kiếm',
      })
    } else {
      res.render('../views/trangChu.hbs', {
        thongBao: "Không tìm thấy bài viết",
      })
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi tìm kiếm bài viết \n Lỗi chi tiết ${error}`);
  }
}

//MẶt hàng
// danh sách mặt hàng
export async function MatHang(req, res) {
  try {
    const dsmatHang = await matHang
      .find({daXoa: false, daDuyet: true, daAn: false})
      .populate('idNguoiDung');
    if (dsmatHang) {
      dsmatHang.sort(function (a, b) {
        return b.thoiGianCapNhat - a.thoiGianCapNhat;
      });
      res.render('../views/matHang.hbs', {
        thongBao: 'Danh sách mặt hàng',
        matHang: dsmatHang.map((matHang) => matHang.toJSON()),
      });
    } else {
      res.render('../views/matHang.hbs', {
        thongBao: 'Danh sách mặt hàng trống',
      });
    }
  } catch (error) {
    console.log(error);
  }
}
// danh sách mặt hàng cần duyệt
export async function DSMatHangCanDuyet(req, res) {
  try {
    const ds = await matHang
      .find({daDuyet: false, daXoa: false, daAn: false})
      .populate('idNguoiDung', 'hoTen');
    if (ds) {
      ds.sort(function (a, b) {
        return b.thoiGianCapNhat - a.thoiGianCapNhat;
      });
      res.render('../views/duyetBai.hbs', {
        thongBao: 'Danh sách mặt hàng cần duyệt',
        ds: ds.map((ds) => ds.toJSON()),
      });
    } else {
      res.render('../views/duyetBai.hbs', {
        thongBao: 'Danh sách duyệt bài trống',
      });
    }
  } catch (error) {
    console.log(error);
  }
}
// duyệt mặt hàng duyetBai: true
export async function DuyetMatHang(req, res) {
  try {
    const matHang1 = await matHang.findById(req.params.id);
    if (matHang1) {
      await matHang.updateOne({_id: req.params.id}, {daDuyet: true});
      res.redirect('/layout/DSduyetBai');
      const TBM = {
        idNguoiDung: matHang1.idNguoiDung,
        idTruyXuat: matHang1._id,
        loaiThongBao: 'MatHang',
        noiDung: 'Mặt hàng của bạn đã được duyệt',
      };
      const thongBaoMoi = new ThongBao(TBM);
      thongBaoMoi.save();
      if (matHang1.nguoiQuanTam.length > 0) {
        for (let i = 0; i < matHang1.nguoiQuanTam.length; i++) {
          const TBM2 = {
            idNguoiDung: matHang1.nguoiQuanTam[i],
            idTruyXuat: matHang1._id,
            loaiThongBao: 'MatHang',
            noiDung: 'Mặt hàng bạn quan tâm có thay đổi. Hãy xem ngay !',
          };
          const thongBaoMoi2 = new ThongBao(TBM2);
          thongBaoMoi2.save();
        }
      }
    } else {
      res.send({thongBao: 'Error'});
    }
  } catch (error) {
    console.log(error);
  }
}
// chặn mặt hàng daXoa: true
export async function ChanMatHang(req, res) {
  try {
    const matHang1 = await matHang.findById(req.params.id);
    if (matHang1) {
      await matHang.updateOne({_id: matHang1._id}, {daXoa: true});
      res.redirect('/layout/matHang');

      const TBM = {
        idNguoiDung: matHang1.idNguoiDung,
        idTruyXuat: req.params.id,
        loaiThongBao: 'MatHang',
        noiDung: `Mặt hàng ${matHang1.tieuDe} của bạn đã bị chặn`,
      };
      try {
        const thongBaoMoi = new ThongBao(TBM);
        await thongBaoMoi.save();
      } catch (error) {
        console.log(error);
      }
    } else {
      res.send({thongBao: 'Mặt hàng không tồn tại'});
    }
  } catch (error) {
    console.log(error);
  }
}
// danh sách mặt hàng bị chặn
export async function DSMatHangBiChan(req, res) {
  try {
    const dsMatHangBiXoa = await matHang
      .find({daXoa: true})
      .populate('idNguoiDung', 'hoTen');
    if (dsMatHangBiXoa) {
      res.render('../views/matHang.hbs', {
        thongBao: 'Danh sách mặt hàng bị xóa',
        matHang: dsMatHangBiXoa.map((ds) => ds.toJSON()),
      });
    } else {
      res.render('../views/matHang.hbs', {
        thongBao: 'Danh sách mặt hàng trống',
      });
    }
  } catch (error) {
    console.log(error);
  }
}
// khôi phục mặt hàng xoaBai: false
export async function KhoiPhuc(req, res) {
  try {
    const matHang1 = await matHang.findById(req.params.id);
    if (matHang1) {
       const TBM = {
        idNguoiDung: matHang1.idNguoiDung,
        idTruyXuat: matHang1._id,
        loaiThongBao: 'MatHang',
        noiDung: `Mặt hàng ${matHang1.tieuDe} của bạn đã được khôi phục`,
      };
      await matHang.updateOne({_id: req.params.id}, {daXoa: false, baoCao: 0});
      await ThongBao.deleteMany({loaiThongBao:"BaoCaoMatHang", idTruyXuat: req.params.id});
      const thongBaoMoi = new ThongBao(TBM);
      await thongBaoMoi.save();
      res.redirect('/layout/danhSachMatHangChan');
    } else {
      res.send({thongBao: 'Error'});
    }
  } catch (error) {
    console.log(error);
  }
}
// mặt hàng chi tiết
export async function MatHangCHiTiet(req, res) {
  try {
    const matHangCT = await matHang
      .findById(req.params.id)
      .populate('idNguoiDung', 'hoTen');
    const dsBaoCao = await ThongBao.find({
      idTruyXuat: matHangCT._id,
      loaiThongBao: 'BaoCaoMatHang',
    }).populate('idNguoiDung');
    if (matHangCT) {
      res.render('../views/matHangChiTiet.hbs', {
        matHangCT: matHangCT.toJSON(),
        ngayDang:
          matHangCT.thoiGianTao.toLocaleTimeString() +
          '/' +
          matHangCT.thoiGianTao.toLocaleDateString(),
        dsBaoCao: dsBaoCao.map((dsbaocao) => dsbaocao.toJSON()),
      });
    } else {
      res.send({thongBao: 'Trống'});
    }
  } catch (error) {
    console.log(error);
  }
}
// danh sách mặt hàng bị báo Cáo
export async function DSMatHangBiBaoCao(req, res) {
  try {
    const dsMatHang = await matHang
      .find({
        baoCao: {$gt: 0},
        daXoa: false,
      })
      .populate('idNguoiDung');
    if (dsMatHang) {
      res.render('../views/matHangBiBaoCao.hbs', {
        thongBao: 'Danh sách mặt hàng bị báo cáo',
        dsMatHang: dsMatHang.map((dsmathang) => dsmathang.toJSON()),
      });
    } else {
      res.render('../views/matHangBiBaoCao.hbs', {
        thongBao: 'Danh sách trống',
      });
    }
  } catch (error) {
    console.log(error);
  }
}
export async function TimKiemMatHang(req, res){
  try {
    const tieuDe = req.body.tieuDe;
    const dsMatHang = await matHang.find({tieuDe: {$regex: tieuDe, $options: "i"}, daXoa: false, daDuyet: true}).populate("idNguoiDung");
    if(dsMatHang.length > 0 ){
      res.render("../views/matHang.hbs", {
        matHang: dsMatHang.map((mathang) => mathang.toJSON()),
        thongBao: "Kết quả tìm kiếm",
      })
    } else {
      res.render("../views/matHang.hbs", {
        thongBao: "Không tìm thấy mặt hàng",
      })
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi tìm kiếm mặt hàng \n Lỗi chi tiết ${error}`);
  }
}

// chuyên sang chế độ chưa duyệt duyetBai: false
export async function BoDuyet(req, res) {
  try {
    const matHang1 = await matHang.findById(req.params.id);
    if (matHang1) {
      await matHang.updateOne({_id: req.params.id}, {duyetBai: false});
      res.redirect('/layout/matHang');
      const TBM = {
        idNguoiDung: matHang1.idNguoiDung,
        idTruyXuat: matHang1._id,
        loaiThongBao: 'MatHang',
        noiDung: 'Mặt hàng của bạn đã đã chuyển sang chế độ chờ duyệt',
      };
      try {
        const thongBaoMoi = new ThongBao(TBM);
        await thongBaoMoi.save();
      } catch (error) {
        console.log(error);
      }
    } else {
      res.send({thongBao: 'Error'});
    }
  } catch (error) {
    console.log(error);
  }
}
