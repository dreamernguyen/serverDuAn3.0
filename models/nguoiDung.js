import mongoose from "mongoose";

const nguoiDungSchema = mongoose.Schema(
  {
    soDienThoai: {type: String, trim: true},
    hoTen: {type: String, required: true, trim: true},
    matKhau: {type: String, trim: true},
    email: {type: String, trim: true},
    diaChi: {type: String},
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dreamernguyen/image/upload/v1619530022/%E1%BA%A2nh%20ng%C6%B0%E1%BB%9Di%20d%C3%B9ng/logo_main.png?fbclid=IwAR3EBKVDHUOfByc-mSj4TgGTF1--wcpmtC2SFgGZ0RKpajpk6WbfRJB6H-I',
        trim: true,
    },
    tieuSu: {type: String, default: 'Thành viên mới'},
    ngaySinh: {type: String},
    gioiTinh: {type: String},
    dangTheoDoi: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NguoiDung',
      },
    ],
    duocTheoDoi: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NguoiDung',
      },
    ],
    baoCao: {type: Number},
  },
  {
    timestamps: {
      createdAt: 'thoiGianTao',
      updatedAt: 'thoiGianCapNhat',
    },
  }
);

const NguoiDung = mongoose.model("NguoiDung", nguoiDungSchema, "nguoiDung");

export default NguoiDung;
