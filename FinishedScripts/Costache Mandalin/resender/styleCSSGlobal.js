function addCssStyle() {
  let cssStyle = `
    .scriptContainer{
        width: ${widthInterface}%;
        background: ${backgroundContainer};
        aspect-ratio: 100 / 29;
        cursor:move;
        z-index:50;
        border-radius: 15px;

        border-style: solid;
        border-width: 5px 5px; 
        border-color:${backgroundHeader};

    }
    .scriptHeader{
        color: ${textColor};
        background: ${backgroundHeader};
        width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: center; 
        align-items: center;    
    }
    .scriptFooter{
        color: ${textColor};
        background: ${backgroundHeader};
        width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: right; 
        align-items: center;  
        margin-right:50px;  
    }


    .scriptTable{
        position: relative; 
        width: 95%; 
        border-collapse: collapse;
        table-layout: fixed;
        margin: 0 auto;
        margin-top:20px;
        margin-bottom:20px;

    }
    .scriptTable td{
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        border-style: solid;
        border-width: 1px 1px; 
        border-color: ${borderColor};
        padding:10px;
        text-align: center;
        color: ${textColor};
        word-wrap: break-word;

    }
    .scriptTable tr:nth-child(odd){
        background: ${getColorDarker(
          backgroundMainTable,
          headerColorAlternateTable
        )};
    }
    .scriptTable tr:nth-child(even){
        background: ${backgroundMainTable};
    }

    

    .scriptTable tr:first-child{
        width: auto;
        border-style: solid;
        border-width: 1px 1px; 
        border-color: ${borderColor};
        padding:15px;
        text-align: center;
        color: ${textColor};
        background: ${getColorDarker(backgroundMainTable, headerColorDarken)};
    }
    .scriptTable tr:not(:first-child):hover {
        background-color: ${getColorDarker(
          backgroundMainTable,
          headerColorAlternateHover
        )};
    }



    .scriptTable3Tr{
        position: relative; 
        width: 95%; 
        border-collapse: collapse;
        table-layout: fixed;
        margin: 0 auto;
        margin-top:20px;
        margin-bottom:20px;

    }
    .scriptTable3Tr td{
        width: auto;
        border-style: solid;
        border-width: 1px 1px; 
        border-color: ${borderColor};
        padding:5px;
        text-align: center;
        color: ${textColor};
        word-wrap: break-word;
    }
    .scriptTable3Tr tr:nth-child(6n+2){
        background: ${getColorDarker(
          backgroundMainTable,
          headerColorAlternateTable
        )};
    }
    .scriptTable3Tr tr:nth-child(6n+3){
        background: ${getColorDarker(
          backgroundMainTable,
          headerColorAlternateTable
        )};
    }
    .scriptTable3Tr tr:nth-child(6n+4){
        background: ${getColorDarker(
          backgroundMainTable,
          headerColorAlternateTable
        )};
    }
    .scriptTable3Tr tr:nth-child(6n+5){
        background: ${backgroundMainTable};
    }
    .scriptTable3Tr tr:nth-child(6n+6){
        background: ${backgroundMainTable};
    }
    .scriptTable3Tr tr:nth-child(6n+7){
        background: ${backgroundMainTable};
    }




    .scriptTable3Tr tr:first-child{
        width: auto;
        border-style: solid;
        border-width: 1px 1px; 
        border-color: ${borderColor};
        padding:15px;
        text-align: center;
        color: ${textColor};
        background: ${getColorDarker(backgroundMainTable, headerColorDarken)};
        position: sticky;
        top: 0;
        z-index: 10;
    }


    .scriptTableInner{
        position: relative; 
        width: 95%; 
        border-collapse: collapse;
        table-layout: fixed;
        margin: 0 auto;
        margin-top:2px;
        margin-bottom:2px;
    }
    .scriptTableInner td{
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        border-style: solid;
        border-width: 2px 2px; 
        border-color: ${borderColor};
        text-align: center;
        color: ${textColor};
        word-wrap: break-word;

    }
    .scriptTableInner tr:nth-child(odd){
        background: ${getColorDarker(
          backgroundInnerTable,
          headerColorAlternateTable
        )};
    }
    .scriptTableInner tr:nth-child(even){
        background: ${backgroundInnerTable};
    }
    .scriptTableInner tr:first-child {
        width: auto;
        border-style: solid;
        border-width: 2px 2px; 
        border-color: ${borderColor};
        padding:15px;
        text-align: center;
        color: ${textColor};
        background: ${getColorDarker(backgroundInnerTable, headerColorDarken)};
    }
    .scriptTableInner tr:not(:first-child):hover {
        background-color: ${getColorDarker(
          backgroundInnerTable,
          headerColorAlternateHover
        )};
    }
    




    
    .scriptTableAlternate{
        position: relative; 
        width: 100%; 
        border-collapse: collapse;
        table-layout: fixed;
        margin: 0 auto;
        margin-bottom:20px;

    }
    .scriptTableAlternate tr:nth-child(odd){
        background: ${backgroundAlternateTableOdd};
    }
    .scriptTableAlternate tr:nth-child(even){
        background: ${backgroundAlternateTableEven};
    }
    .scriptTableAlternate td{
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        border-style: solid;
        border-width: 1px 1px; 
        border-color: ${borderColor};
        padding:10px;
        text-align: center;
        color: ${textColor};
        word-wrap: break-word;

    }
    .scriptTableAlternate tr:first-child {
        position: sticky;
        top: 0;
        z-index: 10;
        padding:10px;
        background: ${getColorDarker(
          backgroundAlternateTableOdd,
          headerColorDarken
        )};

    }
    .scriptTableAlternate tr:not(:first-child):hover {
        background-color: ${getColorDarker(
          backgroundAlternateTableEven,
          headerColorAlternateHover
        )};
    }


    .scriptTableBalancerResult{
        position: relative; 
        width: 95%; 
        border-collapse: collapse;
        table-layout: fixed;
        margin: 0 auto;
        margin-top:20px;
        margin-bottom:20px;

    }
    .scriptTableBalancerResult td{
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        border-style: solid;
        border-width: 1px 1px; 
        border-color: ${borderColor};
        padding:1px;
        text-align: center;
        color: ${textColor};
        word-wrap: break-word;

    }
    .scriptTableBalancerResult tr:not(:first-child):nth-child(even) td:nth-child(-n+4){
        background: ${backgroundMainTable};
    }
    .scriptTableBalancerResult tr:not(:first-child):nth-child(odd) td:nth-child(-n+4){
        background: ${getColorDarker(
          backgroundMainTable,
          headerColorAlternateTable
        )};
    }
    .scriptTableBalancerResult tr:not(:first-child):nth-child(even) td:nth-child(5){
        background: ${headerWoodEven};
    }
    .scriptTableBalancerResult tr:not(:first-child):nth-child(odd) td:nth-child(5){
        background: ${headerWood};
    }
    .scriptTableBalancerResult tr:not(:first-child):nth-child(even) td:nth-child(7){
        background: ${headerStoneEven};
    }
    .scriptTableBalancerResult tr:not(:first-child):nth-child(odd) td:nth-child(7){
        background: ${headerStone};
    }
    
    .scriptTableBalancerResult tr:not(:first-child):nth-child(even) td:nth-child(9){
        background: ${headerIronEven};
    }
    .scriptTableBalancerResult tr:not(:first-child):nth-child(odd) td:nth-child(9){
        background: ${headerIron};
    }
    .scriptTableBalancerResult tr:not(:first-child):nth-child(even) td:nth-child(11){
        background: ${backgroundMainTable};
    }
    .scriptTableBalancerResult tr:not(:first-child):nth-child(odd) td:nth-child(11){
        background: ${getColorDarker(
          backgroundMainTable,
          -headerColorAlternateTable
        )};
    }

    .scriptTableBalancerResult tr:first-child{
        width: auto;
        border-style: solid;
        border-width: 1px 1px; 
        border-color: ${borderColor};
        padding:15px;
        text-align: center;
        color: ${textColor};
        position: sticky;
        top: 0;
        z-index: 10;
        background: ${getColorDarker(backgroundMainTable, headerColorDarken)};
    }
    



    .scriptInput {
        width:50%;
        font-size: 15px;
        background-color : ${backgroundInput};
        border-radius: 10px;
        color:${textColor};
        text-align: center;

    }
    input[type="text"]:disabled {
        background: ${getColorDarker(invertColor(textColor), 50)};
        text-align: center;
    }
    select {
        background: ${backgroundInput};
        color: ${textColor};
        border-radius: 5px;
        width:50%
        text-align:center;
        font-size:15px;
    }



    textarea {
        max-width: 100%; 
        max-height: 100%;
        resize: none;
        overflow-y: scroll;
        
    }
    .tab-panels ul {
        margin: 0;
        padding: 0;
    }
    .tab-panels ul li {
        list-style-type: none;
        display: inline-block;
        background: #999;
        margin: 2px;
        padding: 3px 10px;
        border-radius: 10px 10px 0 0;
        color: #fff;
        font-weight: 200;
        cursor: pointer;
        color:${textColor}

    }
    .tab-panels ul li:hover {
        color: #fff;
        background: #666;
    }

    .tab-panels ul li.active {
        color: #fff;
        background: #666;
    }

    .tab-panels .panel {
        display:none;
        background: ${backgroundHeader};
        padding: 30px;
    }

    .tab-panels .panel.active {
        display:block;
    }

    .shadow20 {
        text-shadow: 0 0 4px black, 0 0 4px black, 0 0 4px black, 0 0 4px black, 0 0 4px black;
    }    
    
    `,
    head = document.head || document.getElementsByTagName("head")[0],
    style = document.createElement("style");

  head.appendChild(style);
  style.type = "text/css";
  if (style.styleSheet) {
    style.styleSheet.cssText = cssStyle;
  } else {
    style.appendChild(document.createTextNode(cssStyle));
  }
}
addCssStyle();

function getColorDarker(hexInput, percent) {
  let hex = hexInput;

  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, "");

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, "$1$1");
  }

  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  const calculatedPercent = (100 + percent) / 100;

  r = Math.round(Math.min(255, Math.max(0, r * calculatedPercent)));
  g = Math.round(Math.min(255, Math.max(0, g * calculatedPercent)));
  b = Math.round(Math.min(255, Math.max(0, b * calculatedPercent)));

  return `#${("00" + r.toString(16)).slice(-2).toUpperCase()}${(
    "00" + g.toString(16)
  )
    .slice(-2)
    .toUpperCase()}${("00" + b.toString(16)).slice(-2).toUpperCase()}`;
}

function invertColor(hex) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}
