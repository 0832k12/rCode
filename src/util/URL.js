rCode.getUrlBases = function (queryString) {
    const pattern = /[\?&]([^=]+)=([^&]+)/g;
    const params = {};
    let match;
  
    while ((match = pattern.exec(queryString)) !== null) {
      const key = decodeURIComponent(match[1]);
      const value = decodeURIComponent(match[2]);
      params[key] = value;
    }
  
    return params;
  }