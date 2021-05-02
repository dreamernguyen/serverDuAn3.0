import express from "express";
import {
  chinhSuaThongTin,
  dangKy,
  dangNhapBangGoogle,
  dangNhapBangSoDienThoai,
  danhSachNguoiDung,
  doiMatKhau,
  huyTheoDoi,
  theoDoi,
  xemTrangCaNhan,
  doiAvatar,
  xemNguoiTheoDoi,
  nguoiDungChiTiet,
  checkSoDienThoai,
  themSoDienThoai,
  QuenMatKhau,
} from '../controllers/nguoiDungController.js';

const router = express.Router();

router.post("/dangKy", dangKy);
router.post("/dangNhap", dangNhapBangSoDienThoai);
router.post("/dangNhapGG", dangNhapBangGoogle);
router.get("/danhSach",danhSachNguoiDung);
router.get("/xemTrangCaNhan/:id",xemTrangCaNhan);
router.post("/theoDoi", theoDoi);
router.post("/huyTheoDoi", huyTheoDoi);
router.post("/chinhSuaThongTin/:id",chinhSuaThongTin);
router.post("/doiMatKhau/:id",doiMatKhau);
router.post("/themSoDienThoai/:id",themSoDienThoai);
router.post('/capNhatAvatar/:id', doiAvatar);
router.get("/xemNguoiTheoDoi/:id", xemNguoiTheoDoi);
router.get('/thongTinChiTiet/:id', nguoiDungChiTiet);
router.post('/checkSoDienThoai/:soDienThoai', checkSoDienThoai);
router.post('/quenMatKhau', QuenMatKhau);
export default router;
