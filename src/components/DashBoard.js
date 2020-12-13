import React, { useState } from "react";
import MyDropzone from "./MyDropzone";
import Button from "@material-ui/core/Button";
import exportExcel from "../utils/excel";

const MainStr = "Main excel";
const SubStr = "Sub excel";

const mainKey = ["图纸编号", "图纸版本", "图纸名称"];
const MainKey = "图纸编号";
const subKey = ["执行图纸编号", "执行图纸版本", "工卡编号"];
const SubKey = "执行图纸编号";

const getKeyPosition = (heads, keyList) => {
  return keyList.reduce(
    (pre, cur) => ({ ...pre, [cur]: heads.indexOf(cur) }),
    {}
  );
};

export default function DashBoard() {
  const [mainData, setMainData] = useState([]);
  const [subData, setSubData] = useState([]);

  const handleReceiveMainExcelArray = (data) => {
    setMainData(data);
  };

  const handleReceiveExcelArray = (data) => {
    setSubData(data);
  };

  const getMatchPosition = (searchMap, searchKey) => {
    if (searchMap[searchKey] !== undefined) {
      return searchMap[searchKey];
    }

    for (var key in searchMap) {
      if (searchKey.indexOf(key) > -1) {
        return searchMap[key];
      }
    }

    return undefined;
  };

  const getMergeData = () => {
    // main *******
    const colPos = getKeyPosition(mainData[0], mainKey);
    const restMainData = mainData.slice(1);
    const mainKeyPos = colPos[MainKey];
    const restMainMap = mainData.reduce(
      (p, c, index) => ({ ...p, [c[mainKeyPos]]: index - 1 }),
      {}
    );
    const newArr = restMainData.map((e) =>
      mainKey.reduce((p, c) => ({ ...p, [c]: e[colPos[c]] }), {})
    );

    // sub ******
    const colSubPos = getKeyPosition(subData[0], subKey);
    const restSubData = subData.slice(1);
    const subKeyPos = colSubPos[SubKey];

    restSubData.forEach((v) => {
      const insertMainPos = getMatchPosition(restMainMap, v[subKeyPos]);

      // const insertMainPos = restMainMap[matchKey];
      if (insertMainPos === undefined) {
        console.log("**** can't find insertMainPos");
        return;
      }

      // insert to main
      const newInsertData = subKey.reduce(
        (p, c) => ({ ...p, [c]: v[colSubPos[c]] }),
        {}
      );
      const sub = newArr[insertMainPos].sub;
      if (!sub) {
        newArr[insertMainPos].sub = [];
      }

      newArr[insertMainPos].sub.push(newInsertData);
    });

    return newArr;
  };

  const getAoaData = (data) => {
    const newArr = [];
    const wholeHeads = [...mainKey, ...subKey];
    newArr.push(wholeHeads);

    let k = {};
    let ccIndex = 1;

    data.forEach((v) => {
      if (!v.sub) {
        return;
      }

      let iiIndex = 0;

      v.sub.forEach((innerV, innerIndex) => {
        const newD = wholeHeads.map((k) => {
          if (innerIndex === 0 && v[k]) return v[k];
          if (innerV[k]) return innerV[k];
          return null;
        });

        iiIndex++;
        newArr.push(newD);
      });

      if (iiIndex > 1) {
        k[ccIndex] = iiIndex - 1;
      }

      ccIndex += iiIndex;
    });

    return { newArr, k };
  };

  const startMerge = () => {
    // const data = getFeckData();
    const data = getMergeData();
    const { newArr, k } = getAoaData(data);

    // console.log("dg>> data", newArr);
    // http://demo.haoji.me/2017/02/08-js-xlsx/
    exportExcel(newArr, k, mainKey.length);
  };

  return (
    <div>
      <div>
        <MyDropzone
          title={MainStr}
          onReceiveExcelArray={handleReceiveMainExcelArray}
        />
      </div>

      <div>
        <MyDropzone
          title={SubStr}
          onReceiveExcelArray={handleReceiveExcelArray}
        />
      </div>

      <Button color="primary" variant="contained" onClick={startMerge}>
        start
      </Button>
    </div>
  );
}
