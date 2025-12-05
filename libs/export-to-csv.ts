import { PRODUCTS_KEY, SALES_KEY } from "@/constants/key-storage";
import { getData, saveData } from "@/storage";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import Papa from "papaparse";

const storageKeys = [SALES_KEY, PRODUCTS_KEY];

/** EXPORT TOUT EN 1 CSV + PARTAGE */
// export const exportAllDataToCSV = async (fileName: string) => {
//   try {
//     let allData: Product[] | Sale[] = [];

//     for (const key of storageKeys) {
//       const data = await getData(key);
//       const typed = data.map((item: Product | Sale) => ({
//         _type: key,
//         ...item,
//       }));
//       allData = [...allData, ...typed];
//     }

//     const csv = Papa.unparse(allData as any);

//     const fileUri = FileSystem.documentDirectory + `${fileName}.csv`;

//     await FileSystem.writeAsStringAsync(fileUri, csv, {
//       encoding: FileSystem.EncodingType.UTF8,
//     });

//     if (await Sharing.isAvailableAsync()) {
//       await Sharing.shareAsync(fileUri);
//     }

//     return fileUri;
//   } catch (err) {
//     console.error("Erreur exportAllDataToCSV :", err);
//     return null;
//   }
// };
export const exportAllDataToCSV = async (fileName: string) => {
  try {
    let allData: any[] = [];

    for (const key of storageKeys) {
      const data = await getData(key);
      const typed = data.map((item: any) => ({ _type: key, ...item }));
      allData = [...allData, ...typed];
    }

    // ---- 1) trouver toutes les clés possibles ----
    const allKeys = Array.from(
      new Set(allData.flatMap((obj) => Object.keys(obj)))
    );

    // ---- 2) uniformiser les objets ----
    const normalized = allData.map((obj) => {
      const row: any = {};
      allKeys.forEach((key) => {
        row[key] = obj[key] ?? "";
      });
      return row;
    });

    // ---- 3) CSV final homogène ----
    const csv = Papa.unparse(normalized);

    const fileUri = FileSystem.documentDirectory + `${fileName}.csv`;

    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    }

    return fileUri;
  } catch (err) {
    console.error("Erreur exportAllDataToCSV :", err);
    return null;
  }
};

/** IMPORTER UN CSV SELECTIONNÉ */
export const importAllDataFromCSV = async (uri: string) => {
  try {
    const csvString = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    const { data: imported } = Papa.parse(csvString, { header: true });

    const regroup: Record<string, any[]> = {
      [SALES_KEY]: [],
      [PRODUCTS_KEY]: [],
    };

    imported.forEach((row: any) => {
      if (!row._type) return;
      const { _type, ...rest } = row;
      regroup[_type].push(rest);
    });

    let response: any = regroup;
    for (const key of storageKeys) {
      // const existing = await getData(key);
      const merged = [
        // ...existing,
        // ...regroup[key].filter(
        //   (item: any) => !existing.some((e: any) => e.id === item.id)
        // ),
        ...regroup[key],
      ];
      await saveData(key, merged);
    }

    return { data: response, success: true };
  } catch (err) {
    console.error("Erreur importAllDataFromCSV :", err);
    return false;
  }
};
