function htmlInfoTable(decorator) {
  const { bottomDecoData, decoData } = decorator;
  let color = "rgba(0, 0, 0, 0.87)";
  if (bottomDecoData) {
    color = bottomDecoData.color;
  }
  if (decoData) {
    color = decoData.color;
  }
  const tableRows = decorator.info.map(
    (row) => `<tr>
      ${row.map((col) => `<td>${col}</td>`).join("")}
    </tr>`
  );
  const table = `<table border="0" 
    style="font-size: 12px;
    color: ${color}
      ">
        ${tableRows.join("")}
        </table>
        `;
  return table;
}

export default htmlInfoTable;
