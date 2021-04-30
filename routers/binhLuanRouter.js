import express from 'express'
import { binhLuan, binhLuanCuaBaiViet, danhSachBinhLuan } from '../controllers/binhLuanController.js'

const router = express.Router();

router.get('/danhSach',danhSachBinhLuan)
router.post('/them/:id',binhLuan)
router.get('/baiViet/:id',binhLuanCuaBaiViet)

export default router;