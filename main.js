import {
  setStorage,
  getStorage,
  translate,
  userIcon,
  icons,
} from "./helpers.js";

//!html'den gelenler
const form = document.querySelector("form");
const input = document.querySelector("form #title");
const cancelBtn = document.querySelector("form #cancel");
const noteList = document.querySelector("ul");
const aside = document.querySelector(".wrapper");
const expandBtn = document.querySelector("#checkbox");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-location");


//! ortak değişkenler
var map;
var coords = [];
var notes = getStorage("NOTES") || [];
var markerLayer = [];

//! olay izleyicileri
// iptal butonuna basınca formun kaldırılması
cancelBtn.addEventListener("click", () => {
  form.style.display = "none";
  clearForm();
});

//* kullanıcının konumuna göre haritaya ekrana basma
function loadMap(coords) {
  // haritanın kurulumunu yapar
  map = L.map("map").setView(coords, 10);

  // hartinaın nasıl gözüküceğini belirler
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // imleçleri tutacağımız ayrı katman oluşturma
  markerLayer = L.layerGroup().addTo(map);

  // kullanıcnın bulunuğu konumunu gösterme
  L.marker(coords, { icon: userIcon })
    .addTo(map)
    .bindPopup("Bulunudğunuz Konum");

  // local storage'den gelen verileri ekrana basma
  renderNoteList(notes);

  // Haritada tıklanma olaylarını izleme
  map.on("click", onMapClick);
}

// inputlar doldurulunca kaydedilmesi
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;
  // notlar dizisine elemanları ekler
  notes.unshift({
    id: new Date().getTime(),
    title,
    date,
    status,
    coords,
  });
  // note'ları listeleme
  renderNoteList(notes);

  // gönderilen elemanları local storage kaydetme
  setStorage(notes);

  // bir not eklendikten sonra form kapatılması
  form.style.display = "none";
  clearForm();
});

// mapte basılan yere imleç koyulması
function renderMarker(item) {
  // imleç oluşturma
  L.marker(item.coords, { icon: icons[item.status] })
    // imleci katmana ekle
    .addTo(markerLayer)
    // popup ekle
    .bindPopup(item.title);
}

// note listesini ekrana bastırma
function renderNoteList(items) {
  // eski eklenen elemanları temizleme
  noteList.innerHTML = "";
  // eski imleçleri temizleme
  markerLayer.clearLayers();
  // her bir eleman için ekrana basma fonksiyonu çalıştırma
  items.forEach((ele) => {
    // li elemanlı oluşturma
    const listEle = document.createElement("li");
    // data-id ekleme
    listEle.dataset.id = ele.id;
    // içeriğini belirleme
    listEle.innerHTML = `
              <div>
                <p>${ele.title}</p>
                <p><span>Tarih:</span><p>${ele.date}</p>
                </p>
                <p><span>Durum:</span><p>${translate[ele.status]}</p>
                </p>
              </div>
              <i id="fly" class="bi bi-airplane-fill"></i>
              <i id="delete" class="bi bi-trash3-fill"></i>
    `;
    // html'deki listeye gönderme
    noteList.appendChild(listEle);
    // ekrana imleç basılması
    renderMarker(ele);
  });
}

//* kullanıcının konumunu isteme
navigator.geolocation.getCurrentPosition(
  // kullanınıcı izin veriirse haritayı
  // onun bulundpu konumda açma
  (e) => loadMap([e.coords.latitude, e.coords.longitude]),
  // izin vermezse varsayılan konumda aç
  () => {
    loadMap([38.802424, 35.505317]);
  }
);

// haritaya tıklanınca çalışan fonksiyon
const onMapClick = (e) => {
  // kordinatları ortak alana aktarma
  coords = [e.latlng.lat, e.latlng.lng];
  // haritaya tıklanınca formu gösterme
  form.style.display = "flex";
  // form gelince inputa focuslanma olayı
  input.focus();
};

// Formu Temizleme
function clearForm() {
  form[0].value = "";
  form[1].value = "";
  form[2].value = "goto";
}

//! Notların yanındaki uçuş ve silme iconu
noteList.addEventListener("click", (e) => {
  const found_id = e.target.closest("li").dataset.id;
  if (e.target.id === "delete") {
    // id'sini bildiğimiz elemanı diziden kaldırma
    notes = notes.filter((note) => note.id !== Number(found_id));
    // local storage güncelleme
    setStorage(notes);
    // ekranı güncelle
    renderNoteList(notes);
  }
  if (e.target.id === "fly") {
    // id'sini bildiğimiz elemanın kordinatlarına erişme
    const note = notes.find((note) => note.id === Number(found_id));

    // animasyonu çalıştır
    map.flyTo(note.coords, 15);

    // elemanın kordinatlarında geçici bir popup tanımlama
    var popup = L.popup().setLatLng(note.coords).setContent(note.title);

    checkbox.checked =false;
    aside.classList.add('hide');
    
    // küçük ekranlarda uçurulduğunda menüyü kapat
    if (window.innerWidth < 769) {
      checkbox.checked = false;
      aside.classList.add("hide");
    }
    // popup'ı açma
    popup.openOn(map);
  }
});

//! Gizle-Göster
checkbox.addEventListener("input", (e) => {
  const isChecked = e.target.checked;

  if(isChecked){
    aside.classList.remove("hide");
  } else {
    aside.classList.add("hide");
  }
})

