// gönderilen verileri local storage kaydetme fonksiyhonju
export const setStorage = (data) => {
  // gelen veriyi stringe çevirme
  const strData = JSON.stringify(data);
  // local'e kaydetme
  localStorage.setItem("NOTES",strData);
};

// local storage'den eleman alıp ekranda kaydetme
export const getStorage = (key) => {
  const strData = localStorage.getItem(key);
  // string gelen veriyi javascript verisine çevirme
  return JSON.parse(strData);
};

// optionda bulunan valuelere karşılık gelen içerikler için
export const translate = {
  goto:"Ziyaret",
  home:"Ev",
  job:"İş",
  park:"Park Yeri"
};

export var userIcon = L.icon({
    iconUrl: '/images/Person.png',
    iconSize: [50, 50],
    popupAnchor: [0, -20]
  });

  export var homeIcon = L.icon({
    iconUrl: '/images/Home_8.png',
    iconSize: [50, 50],
    popupAnchor: [0, -20]
  });

  export var jobIcon = L.icon({
    iconUrl: '/images/Building_8.png',
    iconSize: [50, 50],
    popupAnchor: [0, -20]
  });

  export var gotoIcon = L.icon({
    iconUrl: '/images/Aeroplane_8.png',
    iconSize: [50, 50],
    popupAnchor: [0, -20]
  });

  export var parkIcon = L.icon({
    iconUrl: '/images/Parking_8.png',
    iconSize: [50, 50],
    popupAnchor: [0, -20]
  });

// icon objesi 
export const icons = {
  goto: gotoIcon,
  home: homeIcon,
  job: jobIcon,
  park: parkIcon
};