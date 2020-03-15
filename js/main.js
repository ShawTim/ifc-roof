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
      $(".date").text(fullWidthDate);
    }
  });

  $(".time-picker input").timepicker({
    timeFormat: 'h:mm p',
    defaultTime: '17',
    change: (time) => {
      let hour = time.getHours();
      let minute = time.getMinutes();
      const amPm = hour >= 12 ? 'ＰＭ' : 'ＡＭ';
      hour = hour % 12;
      hour = hour ? hour : 12; // Display 12 am rather than 0 am
      const head = hour > 9 ? '' : space;
      minute = minute < 10 ? '0' + minute : '' + minute;
      const fullWidthTime = convertToFullWidth(head + hour + ':' + minute + amPm);
      console.log('Time is changed to:', fullWidthTime);
      $(".time").text(fullWidthTime);
    }
  });

  $(".location-picker input").keyup((e) => {
    const location = e.target.value;
    $(".location").text(space + space + (location || '香港交易廣場天台'));
  });

  const initDate = new Date();
  const initDateStr = convertToFullWidth(
    (initDate.getMonth() + 1) + '月' + initDate.getDate() + '日'
  );
  $(".date").text(initDateStr);
  $('.time').text(space + convertToFullWidth('5:00') + 'ＰＭ');
  $('.location').text(space + space + '香港交易廣場天台');

  $(".convert-button button").click((e) => {
    // Keeping scrollY is essential for html2canvas@1.0.0-rc.5
    // Ding Hai will find you if you remove it.
    const options = {
      scrollY: -window.scrollY
    };
    html2canvas($(".image-container").get(0), options).then((canvas) => {
      canvas.toBlob((blob) => FileSaver.saveAs(blob, "交易廣場天台.png"));
    });
  });
});
