# idskage
Generate Kage glyph format from IDS

# 組字原理
* 輸入：IDS 或 字
* 輸出：部件以及字框 (kage input format)

* 例一: ⿱艹⿰日月
    首先從第一個IDC知道往後需要兩個部件。除了 U+2FF2 , U+2FF3 需要三個部件，其他IDC都是兩個。
    然後產生上下兩個框，目前只是直接對半。
    第一個框放艹
    第二個框放sub IDS ⿰日月，遞迴呼叫，
      ⿰會產生左右兩個子框，分別放入日及月。
      
  最後產生的資料，就是 艹 佔據了上半部。日佔了左下角，月佔了右下角。
  

* 例二：⿱艹明 (複合部件)
  踫到「明」時，先找「明」的庫存字框 (即kage input format)，若有直接使用，停止遞回。
  如果沒有，則查ids資料庫，取得「明」=「⿰日月」，遞迴算框。
  
* 建議的test suite 順序
 1. ⿰日月  //組只有末級部件的IDS
 2. 明      //顯示已有字框的複合部件
 3. ⿱艹明  //組含有複合部件的IDS，且此複合部件(明)已有庫存字框
 4. ⿱大萌  //組含有複合部件的IDS，且此複合部件(萌)沒有庫存有字框，必須計算。
 5. 加上完整的 IDS (chise database, Extension C,D,E) 參考 https://github.com/ksanaforge/kzy/blob/master/download_chise.js
 6. 找出構字能力強的常用部件，放到庫存字框(可從glyphwiki dump 抽取)，只需放一兩千個庫存字框就可以涵蓋大部份的組字式(比方說「明」就是一個構字能力很強的部件)。常用部件才值得放入庫存，以降低client side開銷，罕用複合部件使用率極低，醜一些無妨。
 7. 組招財進寶。The Holy Grail of CJK font generator.
 
* 改良空間：
 1. 根據部件的複雜度算出適當比例，如「⿰氵森」和「⿰氵夕」，潹的氵應佔較大比例。
 2. 包含型部件。「⿴凵口」和「⿶凵口」是否產生相同結果？
 3. 異體部件，木在左邊時，「捺」必須化為「點」，「木」在上時，豎筆要縮短，系統應根據位置自動選取適當的部件。
 4. IDS 優化，使用端輸入「⿱大⿱艹⿰日月」，因為從「⿱艹⿰日月」可得知為「萌」字，可優化為「⿱大萌」
