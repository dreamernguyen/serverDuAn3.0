import express from "express";
import {
  dangBai,
  danhSachBaiViet,
  xoaBaiViet,
  anBaiViet,
  huyAnBaiViet,
  danhSachBaiVietDangTheoDoi,
  chiTietBaiViet,
  chinhSuaBaiViet,
  thichBaiViet,
  boThichBaiViet,
  danhSachBaiVietYeuThich,
  anKhoiToi,
  baoCaoBaiViet,
  danhSachBaiVietAnCuaToi,
} from '../controllers/baiVietController.js';

const router = express.Router();

router.get("/danhSach", danhSachBaiViet);
router.get("/chiTiet/:id", chiTietBaiViet);
router.post("/dangBai/:id", dangBai);
router.post("/capNhat/:id", chinhSuaBaiViet);
router.post("/xoa/:id", xoaBaiViet);
router.post("/an/:id", anBaiViet);
router.post("/anKhoiToi", anKhoiToi);
router.post("/baoCao", baoCaoBaiViet);
router.get('/dangTheoDoi/:id', danhSachBaiVietDangTheoDoi);
router.post("/thich",thichBaiViet );
router.post("/boThich", boThichBaiViet);
router.get("/danhSachYeuThich/:id",danhSachBaiVietYeuThich)
router.post("/huyAn/:id", huyAnBaiViet);
router.get('/danhSachBaiVietAn/:id', danhSachBaiVietAnCuaToi);

export default router;
