import mongoose from 'mongoose';

const baiVietSchema = mongoose.Schema(
  {
    idNguoiDung: {type: mongoose.Schema.Types.ObjectId, ref: 'NguoiDung'},
    noiDung: {type: String, require: true},
    linkAnh: [{type : String}],
    luotThich: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NguoiDung',
      },
    ],
    anBaiVoi: [
      {
        type: mongoose.Schema.Types.ObjectId
      },
    ],
    daAn: {type : Boolean, default: false},
    daXoa: {type : Boolean, default: false},
    baoCao: {type : Number,default : 0},
  },
  {
    timestamps: {
      createdAt: 'thoiGianTao',
      updatedAt: 'thoiGianCapNhat'
    },
  }
);
const BaiViet = mongoose.model('BaiViet', baiVietSchema, 'baiViet');

export default BaiViet;
