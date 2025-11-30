# Psb

Projekt systemu do scoringu kredytowego (Credit Scoring) dla klientów detalicznych
program będzie przyjmował dane z formularza, obliczał score i zapisywał do localstorage przeglądarki

## Struktura projektu
Aplikacja napisana w Angularze, która pozwala na:
- Tworzenie wniosku kredytowego
- wprowadzanie danych klienta
- wprowadzanie danych kredytowych


## dane do zapisania
- imię
- nazwisko
- data urodzenia
- wykształcenie
- stan cywilny
 
## dane do obliczenia score

### dane kredytowe
- kwota kredytu
- okres kredytu
- stopa procentowa
- typ kredytu

### aktywne kredyty
- kredyt spłacony w czasie
- kredyt spłacony z opóźnieniem

### dochody miesięczne
- dochody miesięczne
- obciążenia stałe miesięczne
- liczba członków rodziny na utrzymaniu
- forma zatrudnienia


**Język:** Polski
**Styl:** Profesjonalna infografika, futurystyczna, czysta, analityczna, z elementami UI bankowości cyfrowej. Użyj głębokiego granatu, błękitu i zieleni, aby oddać wiarygodność i technologię.
**Obiekt:** Schemat Credit Scoring (Scoring Kredytowy).

**Elementy do uwzględnienia:**

1.  **Centralny Punkt:** Duża, okrągła ikona z napisem "**CREDIT SCORE**" (wynik).
2.  **Model Matematyczny (Integracja):** Wokół centralnego wyniku umieść kluczowy, uproszczony wzór w stylu równania na ekranie:
    $$\text{SCORE} = C + \sum (W \times X)$$
    (Gdzie **C** to stała, **W** to Wagi, **X** to Czynniki). Wzór ma być czytelny, ale wkomponowany w design.
3.  **Kategorie Czynników (5 sekcji):** Odprowadzane od centralnego punktu, widoczne jako 5 kluczowych sekcji z ikonami i opisem, zgodnie z wagami:
    * **1. Historia Kredytowa** (Ikona: Kalendarz/Checkmark): Terminowość Spłat, Brak Opóźnień > 90 dni.
    * **2. Zadłużenie** (Ikona: Waga/Wykres): Stosunek Długu do Dochodu (DTI) i Wykorzystanie Limitów.
    * **3. Długość Historii** (Ikona: Klepsydra): Czas trwania najstarszego kredytu.
    * **4. Nowe Kredyty/Zapytania** (Ikona: Lupka/Wniosek): Unikanie nadmiernej liczby zapytań.
    * **5. Mix Kredytowy** (Ikona: Dom + Samochód + Karta): Zróżnicowanie produktów.
4.  **Tło:** Brak tła (transparentne tło lub czyste, białe tło - zależnie od możliwości narzędzia, najlepiej **czysty biały background** dla eksportu).

**Ważna instrukcja dla generatora:** Upewnij się, że tekst i równanie są czytelne, a układ graficzny jest profesjonalny, idealny do prezentacji bankowej.

---

### **Prompt Końcowy do Wykorzystania:**

**"Profesjonalna infografika przedstawiająca mechanizm Scoringu Kredytowego. Schemat powinien zawierać centralny wynik 'CREDIT SCORE' i pięć głównych czynników w otoczeniu (Historia Kredytowa, Zadłużenie, Długość Historii, Liczba Zapytań, Mix Kredytowy), z odpowiednimi ikonami. Grafika musi wizualnie integrować uproszczony wzór matematyczny SCORE = C + suma(W * X). Styl futurystyczny, analityczny, w tonacjach błękitu, granatu i zieleni. Na czystym, białym tle."**# psb
