import express from 'express'
import { guiThongBao, layThongBaoTheoNguoiDung } from '../controllers/thongBaoController.js'

const router = express.Router();

router.post('/guiThongBao',guiThongBao)
router.get('/danhSach/:id',layThongBaoTheoNguoiDung)
export default router
