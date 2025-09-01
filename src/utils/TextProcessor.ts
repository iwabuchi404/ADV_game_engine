// テキストを処理するユーティリティ関数
const processText = (text: string) => {
    if (!text) return '';
    // {br} を改行に変換
    return text.replace(/{br}/g, '\n');
  };

  export default processText;
