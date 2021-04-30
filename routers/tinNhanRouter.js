import express from 'express'
import { danhSachTinNhan, nhanTin, danhSachLienHe, xoaTinNhan, cuocTroChuyen, xoaToanBoCuocTroChuyen } from '../controllers/tinNhanController.js'

const router = express.Router();

router.post('/chat',nhanTin)
router.get('/danhSachLienHe/:id',danhSachLienHe)
router.post('/troChuyen',cuocTroChuyen)
router.get('/danhSach',danhSachTinNhan)
router.post('/xoaTinNhan/:id',xoaTinNhan)
router.get('/xoaToanBoCuocTroChuyen/:idNguoiDung',xoaToanBoCuocTroChuyen)
export default router
