import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import XLSX from "xlsx";

// title
function MyDropzone(props) {
  const { title, onReceiveExcelArray } = props;
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString; // !! converts object to boolean

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const bstr = reader.result;
        var workbook = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
        var sheet_name_list = workbook.SheetNames[0];
        var jsonFromExcel = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheet_name_list],
          {
            raw: false,
            dateNF: "MM-DD-YYYY",
            header: 1,
            defval: "",
          }
        );
        onReceiveExcelArray(jsonFromExcel)
      };
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>{title}</p>
    </div>
  );
}

export default MyDropzone;
