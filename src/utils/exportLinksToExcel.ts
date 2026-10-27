
import * as XLSX from "xlsx-js-style";
import type { LinkItem } from "../types/link";

export function exportLinksToExcel(links: LinkItem[]) {
  if (links.length === 0) {
    window.alert("Belum ada tautan yang dapat diekspor.");
    return;
  }

  const workbook = XLSX.utils.book_new();

  const columns = [
    "No.",
    "Kategori",
    "Nama Aplikasi",
    "Deskripsi",
    "URL",
  ];

  const sortedLinks = [...links].sort((a, b) => {
    const categoryCompare = a.category.localeCompare(
      b.category,
      "id",
    );

    if (categoryCompare !== 0) {
      return categoryCompare;
    }

    return a.title.localeCompare(b.title, "id");
  });

  const createSheet = (items: LinkItem[]) => {
    const rows = items.map((link, index) => ({
      "No.": index + 1,
      "Kategori": link.category,
      "Nama Aplikasi": link.title,
      "Deskripsi": link.description,
      "URL": link.url,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: columns,
    });

    const headerColor = "D9EAF7";

    for (let col = 0; col < columns.length; col++) {
        const cellAddress = XLSX.utils.encode_cell({
        r: 0,
        c: col,
        });

        if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
            fill: {
            patternType: "solid",
            fgColor: { rgb: headerColor },
            },
            font: {
            bold: true,
            color: { rgb: "17365D" },
            },
            alignment: {
            horizontal: "center",
            vertical: "center",
            },
        };
        }
    }

    // Tinggi baris header.
    worksheet["!rows"] = [
        { hpt: 25 },
    ];


    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 22 },
      { wch: 32 },
      { wch: 48 },
      { wch: 55 },
    ];

    worksheet["!autofilter"] = {
      ref: XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: {
          r: items.length,
          c: columns.length - 1,
        },
      }),
    };

    worksheet["!freeze"] = {
      xSplit: 0,
      ySplit: 1,
    };

    // Jadikan URL sebagai hyperlink yang bisa diklik.
    items.forEach((link, index) => {
      const cellAddress = XLSX.utils.encode_cell({
        r: index + 1,
        c: 4,
      });

      const cell = worksheet[cellAddress];

      if (cell && link.url) {
        cell.l = {
          Target: link.url,
          Tooltip: `Buka ${link.title}`,
        };
      }
    });

    return worksheet;
  };

  // Lembar pertama berisi semua tautan yang dikelompokkan
  // berdasarkan kategori, kemudian diurutkan berdasarkan nama.
  XLSX.utils.book_append_sheet(
    workbook,
    createSheet(sortedLinks),
    "Semua Tautan",
  );

  // Tambahkan satu lembar kerja untuk setiap kategori.
  const groupedLinks = new Map<string, LinkItem[]>();

  for (const link of sortedLinks) {
    const items = groupedLinks.get(link.category) ?? [];
    items.push(link);
    groupedLinks.set(link.category, items);
  }

  const usedSheetNames = new Set(["Semua Tautan"]);

  for (const [category, items] of groupedLinks) {
    // Nama sheet Excel maksimal 31 karakter dan tidak boleh
    // mengandung karakter tertentu.
    const baseName =
      category
        .replace(/[\\/?*[\]:]/g, "-")
        .trim()
        .slice(0, 31) || "Kategori";

    let sheetName = baseName;
    let suffix = 2;

    while (usedSheetNames.has(sheetName)) {
      const ending = ` (${suffix})`;
      sheetName =
        `${baseName.slice(0, 31 - ending.length)}${ending}`;
      suffix += 1;
    }

    usedSheetNames.add(sheetName);

    XLSX.utils.book_append_sheet(
      workbook,
      createSheet(items),
      sheetName,
    );
  }

  XLSX.writeFile(
    workbook,
    "Daftar-Portal-Samudra.xlsx",
  );
}
