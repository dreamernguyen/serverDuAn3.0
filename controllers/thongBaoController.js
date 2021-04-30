import ThongBao from "../models/thongBao.js";

export async function guiThongBao(req, res) {
  try {
    const thongBaoMoi = new ThongBao(req.body);
    thongBaoMoi.save();
    res.send(
      `Thông báo thành công đến người dùng ${req.body.idNguoiDung}\n Nội dung thông báo : ${req.body.noiDung}`
    );
  } catch (error) {
    console.log("error");
  }
}

export async function layThongBaoTheoNguoiDung(req, res) {
  try {
    await ThongBao.find({
      idNguoiDung: req.params.id,
      loaiThongBao: { $ne: "BaoCaoBaiViet" },
    })
      .populate("idNguoiDung")
      .then((list) => {
        list.sort(function (a, b) {
          return b.thoiGianTao - a.thoiGianTao;
        });
        res.send(list);
      });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
