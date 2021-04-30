import BinhLuan from "../models/binhLuan.js";
import BaiViet from "../models/baiViet.js";
import NguoiDung from "../models/nguoiDung.js";
import ThongBao from "../models/thongBao.js";

export async function binhLuan(req, res){
  try {
    const binhLuanMoi = new BinhLuan({
      noiDung: req.body.noiDung,
      idBaiViet : req.body.idBaiViet,
      idNguoiDung: req.params.id,
    });
    const nguoiDung = await NguoiDung.findById(req.params.id);
    if(nguoiDung){
      const baiViet = await BaiViet.findById(req.body.idBaiViet);
      if(baiViet){
        await binhLuanMoi.save();
        res.send({
          thongBao: "Bình luận thành công"
        })
        if(baiViet.idNguoiDung !== nguoiDung._id){
          const thongBaoMoi = new ThongBao({
            idNguoiDung: baiViet.idNguoiDung,
            idTruyXuat: baiViet._id,
            loaiThongBao: "BaiViet",
            noiDung: `${nguoiDung.hoTen} vừa bình luận bài viết của bạn`,
          });
          thongBaoMoi.save()
        }
      } else {
        res.send({thongBao: "Không tìm thấy bài viết"})
      }
    }else{
      res.send({thongBao: "Không tìm thấy người dùng"})
    }
    
  } catch (error) {
    console.log(error);
    throw new Error(`Bình luận không thành công ! \nChi tiết lỗi : ${error}` );
  }
}

export async function binhLuanCuaBaiViet(req, res){
  try {
    const baiViet = await BaiViet.findById(req.params.id);
    if(baiViet){
      const danhSachBinhLuan = await BinhLuan.find({idBaiViet : req.params.id}).populate('idNguoiDung')
      res.send({
        danhSachBinhLuan : danhSachBinhLuan
      })
    } else {
      res.send({thongBao: "Không tìm thấy bài viết"})
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Lỗi lấy danh sách bình luận ! \nChi tiết lỗi : ${error}` );
  }
}
export async function danhSachBinhLuan(req, res) {
    
  await BinhLuan.find().then((result) => {
      res.send(result);
    })
    .catch((err) => {
        res.send({thongBao : 'Lỗi lấy danh sách bình luận'})
        console.log('Lỗi '+err.message)
    });
}
