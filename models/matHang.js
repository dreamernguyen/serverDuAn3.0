import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const matHangSchema = mongoose.Schema(
  {
    idNguoiDung: {
      type: Schema.Types.Object,
      ref: 'NguoiDung',
      required: true,
    },
    hangMuc: {
      type: String,
    },
    tieuDe: {
      type: String,
    },
    giaBan: {
      type: Number,
    },
    moTa: {
      type: String,
    },
    diaChi: {
      type: String,
    },
    linkAnh: [],
    nguoiQuanTam :  [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NguoiDung',
      },
    ],
    daDuyet: {
      type: Boolean,
      default: false,
    },
    daAn: {
      type: Boolean,
      default: false,
    },
    daXoa: {
      type: Boolean,
      default: false,
    },
    baoCao: {type : Number,default : 0},
  },
  {
    timestamps: {
      createdAt: 'thoiGianTao',
      updatedAt: 'thoiGianCapNhat',
    },
  }
);
const MatHang = mongoose.model('MatHang', matHangSchema, 'matHang');
export default MatHang;
