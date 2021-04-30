import express from "express";
import {
  themMatHang,
  xoaMatHang,
  chinhSuaMatHang,
  danhSachMatHang,
  matHangChiTiet,
  danhSachToiBan,
  timKiem,
  quanTam,
  boQuanTam,
  danhSachQuanTam,
  baoCaoMatHang,
} from '../controllers/matHangController.js';

const router = express.Router();

router.post('/dangMatHang/:id', themMatHang);
router.post('/xoa/:id', xoaMatHang);
router.post('/chinhSua/:id', chinhSuaMatHang);
router.get('/danhSach', danhSachMatHang);
router.post('/chiTiet/:id', matHangChiTiet);
router.get('/danhSachToiBan/:id', danhSachToiBan)
router.post('/timKiem', timKiem);
router.post("/quanTam",quanTam );
router.post("/boQuanTam", boQuanTam);
router.get("/danhSachQuanTam/:id",danhSachQuanTam);
router.post("/baoCao", baoCaoMatHang);
export default router;
