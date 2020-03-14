import html2canvas from 'html2canvas';
import FileSaver from "file-saver";

// Full Width colon
const colon = String.fromCharCode(65306);
// Ideographic space as CJK block
const space = String.fromCharCode(12288);

// Convert "0123456789:" to "０１２３４５６７８９："
function convertToFullWidth(sentense) {
  let output = sentense.replace(/[0-9\:]/g, function(char) {
    return String.fromCharCode(char.charCodeAt(0) + 0xfee0);
  });
  return output;
}

// For test purpose in browser console
if (typeof window !== 'undefined' && window !== null) {
  window.test = {
    colon: colon,
    space: space,
    convertToFullWidth: convertToFullWidth
  };
}

$(function() {
  $(".date-picker").datepicker({
    dateFormat: "m d",
    onSelect: (date) => {
      const arr = date.split(' '); // Array<string>
      const fullWidthDate = convertToFullWidth(arr[0] + '月' + arr[1] + '日');
      console.log('Date is changed to:', fullWidthDate);
      $(".month").text(fullWidthDate);
    }
  });

  $(".time-picker input").timepicker({
    timeFormat: 'h:mm p',
    defaultTime: '17',
    change: (time) => {
      const hour = time.getHours();
      const minute = time.getMinutes();
      const hourStr = '' + (hour > 12 ? hour - 12 : hour);
      const minuteStr = '' + (minute < 10 ? '0' + minute : minute);
      const amPm = hour >= 12 ? 'ＰＭ' : 'ＡＭ';
      const fullWidthTime = convertToFullWidth(hourStr + ':' + minuteStr + amPm);
      console.log('Time is changed to:', fullWidthTime);
      $(".hour").text(fullWidthTime);
    }
  });

  $(".location-picker input").keyup((e) => {
    const location = e.target.value;
    $(".location").text(location || "香港交易廣場天台");
  })

  const initDate = new Date();
  const initDateStr = convertToFullWidth(
    (initDate.getMonth() + 1) + '月' + initDate.getDate() + '日'
  );
  $(".month").text(initDateStr);

  $(".convert-button button").click((e) => {
    html2canvas($(".image-container").get(0)).then((canvas) => {
      canvas.toBlob((blob) => FileSaver.saveAs(blob, "交易廣場天台.png"));
    });
  });
});
