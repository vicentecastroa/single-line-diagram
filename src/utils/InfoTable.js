function htmlInfoTable(decorator) {
  const { bottomDecoData, decoData } = decorator;
  let color = "rgba(0, 0, 0, 0.87)";
  if (bottomDecoData) {
    color = bottomDecoData.color;
  }
  if (decoData) {
    color = decoData.color;
  }
  const tableRows = decorator.info.map((row) => {
    let textColor = color;
    const rowOptions = row[row.length - 1];
    if (typeof rowOptions === "object" && rowOptions !== null) {
      if (rowOptions.color) {
        textColor = rowOptions.color;
      }
    }
    return `<tr>
      ${row
        .filter((col) => !(typeof col === "object" && col !== null))
        .map((col) => `<td style="color: ${textColor}">${col}</td>`)
        .join("")}
    </tr>`;
  });
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
