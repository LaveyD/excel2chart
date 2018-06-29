const XLSX = require('xlsx')
const fs = require('fs')

const workbook = XLSX.readFile('上海多目标联动经营仿真预测模型-0628(加经济活动分析）.xlsm')

const targetSheet = workbook.Sheets['动态展示']
// console.log(Object.keys(targetSheet))
// console.log(XLSX.utils.sheet_to_html(workbook.Sheets['动态展示']))

const jsonData = XLSX.utils.sheet_to_json(targetSheet, { header: 'A' })
// console.log(jsonData)

const getKey = (old, idx) => {
  return old + idx
}

const formateNum = num => { 
  return num ? num.replace('(', '-').replace(')', '').replace(/ /g, '').replace(',', '') : num
}

const newObj = {}
const rowAdd = 2

jsonData.forEach((item, i) => {
  const keys = Object.keys(item)
  keys.forEach(key => {
    const newKey = getKey(key, i + rowAdd)
    newObj[newKey] = formateNum(item[key])
  })
})

fs.writeFile('./data/excel.json', JSON.stringify(newObj), (err) => {
  if (err) console.log(err)
});