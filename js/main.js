import html2canvas from 'html2canvas';

const convertImage = () => {
  html2canvas($(".image-container").get(0)).then((canvas) => $(".download-link").attr("href", canvas.toDataURL()));
};

$(function() {
  $(".date-picker").datepicker({
    dateFormat: "m d",
    onSelect: (date) => {
      const arr = date.split(' ');
      $(".month").text(arr[0]);
      $(".day").text(arr[1]);
      convertImage();
    }
  });

  $(".time-picker input").timepicker({
    timeFormat: 'h:mm p',
    defaultTime: '17',
    change: (time) => {
      const hour = time.getHours();
      const minutes = time.getMinutes();
      $(".hour").text(hour > 12 ? hour-12 : hour);
      $(".minute").text(minutes < 10 ? '0'+minutes : minutes);
      convertImage();
    }
  });

  $(".location-picker input").keyup((e) => {
    const location = e.target.value;
    $(".location").text(location || "香港交易廣場天台");
    convertImage();
  })

  $(".month").text(new Date().getMonth()+1);
  $(".day").text(new Date().getDate());
  convertImage();
});
