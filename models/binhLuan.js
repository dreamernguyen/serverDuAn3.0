import mongoose from "mongoose";

const binhLuanSchema = mongoose.Schema(
  {
    idNguoiDung: { type: mongoose.Schema.Types.ObjectId, ref: "NguoiDung" },
    idBaiViet : {type: mongoose.Schema.Types.ObjectId},
    noiDung: {type :String,require: true},
  },
  {
    timestamps: {
      createdAt: "thoiGianTao",
      updatedAt: "thoiGianCapNhat",
    },
  }
);

const binhLuan = mongoose.model("BinhLuan", binhLuanSchema, "binhLuan");

export default binhLuan;
