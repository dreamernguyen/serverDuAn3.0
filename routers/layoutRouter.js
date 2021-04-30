import express from "express";
import {
  // bài viết
  TrangChu,
  XoaBaiViet,
  BaiVietBiGo,
  KhoiPhucBaiViet,
  BaiVietBiBaoCao,
  BaiVietChiTiet,
  TimKiemBaiViet,
  // mặt hàng
  MatHang,
  DSMatHangCanDuyet,
  MatHangCHiTiet,
  ChanMatHang,
  DuyetMatHang,
  DSMatHangBiChan,
  BoDuyet,
  KhoiPhuc,
  DSMatHangBiBaoCao,
  TimKiemMatHang,
  // người dùng
  DSNguoiDung,
  NguoiDungChiTiet,
  XoaNguoiDung,
  TimKiemNguoiDung,
} from '../controllers/layoutController.js';
const router = express.Router();
// bai viet 
router.get("/trangChu", TrangChu);
router.get("/xoaBaiViet/:id", XoaBaiViet);
router.get("/khoiPhucBaiViet/:id", KhoiPhucBaiViet);
router.get('/danhSachBaiVietDaXoa', BaiVietBiGo);
router.get('/BaiVietBiBaoCao', BaiVietBiBaoCao);
router.get('/baiVietChiTiet/:id', BaiVietChiTiet);
router.post('/timKiemBaiViet', TimKiemBaiViet);
// mat hang
router.get('/matHang', MatHang);
router.get('/matHangChiTiet/:id', MatHangCHiTiet);
router.get('/DSduyetBai', DSMatHangCanDuyet);
router.get('/duyetBai/:id', DuyetMatHang);
router.get('/danhSachMatHangChan', DSMatHangBiChan);
router.get('/xoaMatHang/:id', ChanMatHang);
router.get('/khoiPhucMatHang/:id', KhoiPhuc);
router.get('/boDuyetMatHang/:id', BoDuyet);
router.get('/matHangBiBaoCao', DSMatHangBiBaoCao);
router.post('/timKiemMatHang', TimKiemMatHang);


// nguoi dung
router.get('/DSNguoiDUng', DSNguoiDung);
router.get('/nguoiDungChiTiet/:id', NguoiDungChiTiet);
router.get('/xoaNguoiDung/:id', XoaNguoiDung);
router.post('/timKiemNguoiDung', TimKiemNguoiDung);
export default router;