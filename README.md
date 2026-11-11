# NEBOSA TOWER / Wrocław

Samodzielna strona HTML, CSS i JavaScript bez instalacji oraz procesu kompilacji. Fikcyjna inwestycja, 81 lokali na piętrach 2–28. Wszystkie ceny, lokalizacja, dostępność, powierzchnie i schematy są demonstracyjne. Nie jest to rzeczywista oferta nieruchomości.

## GitHub Pages
Rozpakuj ZIP. Wgraj **zawartość**, a nie cały nadrzędny folder, do repozytorium: index.html, styles.css, script.js, apartments.js, folder assets i .nojekyll. Settings → Pages → Deploy from a branch → main → /(root). Wszystkie lokalne odwołania są względne, więc strona działa również pod /NazwaRepozytorium/. Nie wymaga Next.js ani serwera API. Przy aktualizacji zastąp pliki i zachowaj folder assets.

## Interakcje
- Prezentacja sterowana przewijaniem: zbliżenie elewacji, przenikanie do balkonu, następnie do wnętrza. To montaż trzech wizualizacji i animacja kamery 2D, a nie spacer 3D ani film poklatkowy z rzeczywistego modelu budynku. Przy ograniczeniu ruchu etapy wybiera się przyciskami 01/02/03.
- Klikalne piętra budynku, wybór suwakiem i +/−, obsługa klawiaturą (Enter/Spacja, strzałki).
- Karta lokalu: powierzchnia, pokoje, piętro, balkon/taras, ekspozycja, cena brutto oraz cena za m², harmonogram pomieszczeń, wyposażenie i dodatki.
- Schematy są bez skali i nie zastępują dokumentacji. Wizualizacje wnętrza i balkonu prezentują wspólny styl inwestycji, nie indywidualny układ każdego lokalu.
- Filtrowanie po pokojach, powierzchni, budżecie, dostępności; sortowanie i doładowanie listy.
- Pobieranie karty tekstowej, formularz demonstracyjny bez wysyłania danych. Ceny brutto dodatków pokazano osobno; cena za m² jest dokładnie powiązana z ceną lokalu.

## Źródła i grafiki
Autorskie wizualizacje wygenerowane narzędziem imagegen: assets/tower.jpg, assets/balcony.jpg, assets/interior.jpg. Fonty Manrope i Cormorant Garamond z Google Fonts, z lokalnymi fontami zastępczymi. Pozostałe interfejsy i schematy lokali są kodem SVG/CSS.

Prompty: tower — photorealistic fictional 28-storey residential tower beside Wroclaw-like river embankment, bronze mullions, curved balconies, soft morning light, wide landscape; balcony — viewpoint variant of same building, approach to an 18th-floor balcony, open living room, Wroclaw skyline; interior — spacious ivory/walnut apartment with panoramic glazing, bronze frames, river and historic European skyline. Bez tekstu i znaków wodnych.

Podgląd lokalny: node preview.cjs → http://127.0.0.1:8801 . Publikowane pliki znajdują się w dist.


## Spacer 3D (aktualizacja)
Na każdym piętrze są trzy lokale A/B/C. Karta lokalu otwiera interaktywny model WebGL: obrót myszą lub palcem, poruszanie W A S D i strzałkami ekranowymi, kliknięcie podłogi, trasy do pomieszczeń, minimapa i makieta z góry. Działa przełączanie lokali i oświetlenia. Układ pokoju wynika ze wspólnego NEBOSA_LAYOUT i powierzchni z katalogu; to model koncepcyjny, nie inwentaryzacja BIM ani fotorealistyczny skan. Geometryczne wyposażenie i model otoczenia są poglądowe. Karty 2D i minimapa używają tego samego układu co model 3D.

Biblioteka Three.js 0.180.0 jest w folderze vendor, z licencją MIT THREE-LICENSE.txt. Brak zewnętrznego CDN podczas uruchamiania spaceru. Wgraj również walkthrough.js, walkthrough.css i cały folder vendor do GitHub Pages. Bez bundlera, bez serwera API. Moduły wymagają HTTP/HTTPS — lokalnie uruchom node preview.cjs; samo otwarcie pliku file:// nie uruchomi spaceru. Brak WebGL 2 pokazuje alternatywę powrotu do karty.

Dawna panorama assets/wroclaw-panorama.jpg pozostaje archiwalnym plikiem. Spacer nie wczytuje jej jako tła: otoczenie jest teraz geometrią 3D.


## Biały model architektoniczny
Domyślny spacer używa białego modelu z materiałami fizycznymi, oświetleniem środowiskowym i miękkim cieniowaniem na komputerze. Przycisk Model biały / Materiały przełącza wykończenie. Wyposażenie ma modelowane kształty: WC z miską, deską, podniesioną pokrywą, spłuczką i przyciskami; umywalka, bateria, lustro z odbiciem, prysznic, lodówka, piekarnik, płyta, wyprofilowane krzesła i pościel. Dodatkowe moduły są lokalnie w vendor, bathroom-fixtures.js i furniture-details.js. Lustra aktualizują odbicie w odwiedzanym pomieszczeniu; cieniowanie ekranowe jest aktywne na komputerze, na telefonie używane są lżejsze cienie i materiały.

Kliknięcie lokalu na elewacji/listach otwiera bezpośrednio spacer. Kliknięcie podłogi wyznacza trasę; kamera płynnie skręca, przyspiesza i zwalnia. Przeciąganie obraca widok, bez przypadkowego wyboru celu po geście przeciągania. Dane i pełna karta są nadal dostępne po rozwinięciu panelu lokalu.


Dodatkowo: wyprofilowane skorupowe krzesła, poprawiona długość i orientacja łóżek w małych lokalach, realistyczniejsza roślinność, cienie kontaktowe i wygładzanie krawędzi na komputerze. Wszystkie dodatki Three.js są objęte dołączoną licencją MIT. Makieta pozostaje trybem dodatkowym — domyślne wejście to spacer z wysokości oczu.


Czytelność: powiększone napisy pomocnicze, opisy, etykiety cen, formularz i kontrolki spaceru. Przycisk Porozmawiajmy ma wyrównanie flex i wektorową strzałkę SVG niezależną od fontu urządzenia.



## Przestrzeń i elewacja
Cztery odrębne szablony układu dla 2–5 pokoi, skalowane do powierzchni konkretnego lokalu. Hol otwiera się na salon; większe lokale mają galerię w kształcie L, a pięciopokojowe salon z dwiema dodatkowymi strefami. Przejścia są szersze, balkony krótsze i głębsze. Powierzchnie harmonogramu i rzuty odpowiadają częściom modelu.

Moduł exterior-context.js tworzy pełny kontekst wieży: kamienne zaokrąglone płyty stropowe, brązowe profile, przeszklenia i balustrady kolejnych pięter, sąsiednie balkony. Kontekst zachowuje materiały również przy białym modelu wnętrza. Miasto, rzeka, most, promenady, drzewa i zabudowa z oknami to ostre obiekty 3D, grupowane instancjami dla wydajności. Jest to autorska, umowna zabudowa inspirowana Wrocławiem, nie rzeczywista mapa ani skan miasta. W makiecie kontekst jest ukryty, aby można było obejrzeć sam lokal.


## Prawdziwy Wrocław i wejście główne
Proceduralna zabudowa miasta została zastąpiona prawdziwą fotografią Wrocławia z punktu widokowego Sky Tower: Alexey Vazhnov, 31.07.2022, CC BY-SA 4.0. Pełne źródło, warunki i opis adaptacji wyświetlania: dist/assets/PHOTO-CREDITS.txt (w ZIP: assets/PHOTO-CREDITS.txt). Zdjęcie jest lokalnym plikiem; brak API Google i kluczy. Jest to tło fotograficzne, nie rzeczywisty model miasta ani pełny, geolokalizowany skan 360. Widok w tylnej półsferze powtarza zdjęcie. Kamienna elewacja i balkony wieży pozostają w 3D. Hol każdego wariantu ma jedne zewnętrzne drzwi wejściowe: skrzydło, futrynę, próg, uszczelkę, klamkę, wizjer i numer lokalu. Drzwi są zamknięte i ograniczają ruch kamery.


## Drzwi wewnętrzne i strefa TV
Sypialnie, gabinet, łazienka i WC mają pełne skrzydła z ościeżnicami, klamkami, zawiasami i tabliczkami. Drzwi otwierają się płynnie przy podejściu, podczas nawigacji do pokoju lub po kliknięciu. Strona zawiasów i kierunek otwierania są dobierane po ustawieniu mebli; kamera ma kolizję z obróconym skrzydłem. Drzwi główne pozostają zamknięte, a salon, aneks i otwarta galeria zachowują wspólną przestrzeń. Układ NEBOSA_SEATING wiąże sofę z telewizorem: wspólna oś patrzenia i obrócenie sofy w stronę ekranu, stolik i dywan między nimi, przejście od strony kuchni.

W pięciopokojowych lokalach zabudowa kuchni zaczyna się za drzwiami gabinetu, zachowując wolne wejście.


## Korekta wyposażenia i czytelności
Kuchnia jest jedną spójną zabudową modułową przy rzeczywistej zewnętrznej ścianie. W salonach L-kształtnych korzysta z prawego skrzydła, a nie z umownej krawędzi części głównej. Brak podwójnych szafek nakładających się na lodówkę; blat ma otwór na zlew. Stół i krzesła mają wspólną regułę ustawienia, zwrócone ku sobie siedziska i kolizje kamery. Małe sypialnie nie mają wciskanych na siłę szaf; w większych szafa nie koliduje ze stolikiem. Umywalki, lustra i WC odsunięto od okładzin. Usunięto dekoracje przy drzwiach, zbędne rośliny oraz nachodzące na meble etykiety 3D. Powiększono drobny tekst w stronie, kartach lokali i kontrolkach spaceru.

Przycisk Kuchnia w nawigacji spaceru prowadzi do bezpiecznego punktu przed zabudową, również w salonie L-kształtnym.

Uzupełniono podpory sofy i fotela balkonowego; krzesło w gabinecie ma nogi i prawidłowy kierunek siedzenia. Monitor ma podstawę. Uproszczono dekoracje na sąsiednich balkonach. Trasa spaceru uwzględnia położenie otwartego skrzydła drzwi.
Kontrole: node validate.cjs; node check-interiors.mjs; node check-fit.mjs. Ostatnia sprawdza gotową geometrię kuchni, sypialni i łazienek oraz obrysy strefy siedzenia.
