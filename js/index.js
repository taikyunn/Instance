var vm1 = new Vue({
  el :'#app1',
  data: {
    message: 'インスタンス1',
  },
})

// 複数のインスタンスにわたって使用したい場合は、componentを使用する
// 但しこのcomponentが使用できるのは記述した以降のインスタンスのみ。今回の場合はapp1インスタンス内では使用できない。
Vue.component('hello', {
  template: '<p>こんにちは</p>'
});

var vm2 = new Vue({
  el :'#app2',
  data: {
    message: 'インスタンス2',
  },
  methods: {
    changeMessage: function() {
      // vueのインスタンスに外側からアクセスしたい時
      // new Vueする前にvar 変数 = を追加することで変数名でアクセスできる
      vm1.message = 'インスタンスを変更しました。'
    }
  }
})

// dataには後から設定することはできないが、先に下記のように定義してあげることはできる。
// var data = {
//   message: 'こんにちは',
//   name: '田中'
// }
var vm3 = new Vue({
  // elタグでとれるのはcssと同じ形である
  el :'#app3',
  data: {
    message: 'こんにちは',
    name: '田中',
  },
  computed: {
    myData: function() {
      // 同じインスタンス内で$dataを呼び出したい場合は、this.$dataで呼び出せる
      return this.$data
    }
  }
})

// $mountはelプロパティの代わりになる
// vm3.$mount('#app')

// Vueインスタンスが使用できるものは$がついている。
// console.log(vm3)を検証ツールで確認し出てきた$を確認すること
console.log(vm3)
// dataの中身をみたいときは以下のように書く。
console.log(vm3.$data)

// インスタンスの外からアクセスする場合、値を入れることはできるがリアクティブにならない。
// リアクティブとは、Vueの反映をhtml側に与えること。vueインスタンスに標準搭載されている
// Vueはインスタンスを生成すると、上から順に読み込んでいき、dataに定義されているものに関してはリアクティブになるための色々な処理を与えてくれている。つまりdataに定義されていないとリアクティブにならない。
// getter(reactiveGetter())とsetter(reactiveSetter(newVal))を与える処理を行なっている。検証ツールを利用するとnameにはgetterとsetterがない
// これら様々な処理をまとめてwatcherという
// リアクティブにしたければ空文字でいいからdataに定義すること
vm3.message = '変更しました。'
vm3.name = '田中'


new Vue({
  data: {
    name: '田中',
  },
  // templateプロパティはhtmlをそのまま''で囲ってあげると表示させることができる。
  template: '<h1>こんにちは、{{ name }}さん。</h1>'
// $mountは変数に置かなくても下記のように直接書くこともできる
}).$mount('#app4')

new Vue({
  data: {
    name: '田中',
  },
  // render関数を書いてhtmlを返すにはcreateElementというメソッドを引数にとってあげる
  // しかしcreateElementではなくhなどなんでもok(hはよく使われるらしい)
  // render内のcreateElementと下のcreateElementは全くの別物
  // render内のcreateElementはconsole.logをするとオブジェクト形式で出力される。
  // これを仮想ノードという。
  // DOMはブラウザ側が持っている(Document Object Model)これにアクセスして変更を行う


  // まとめると、vue内でのcreateElementはDOMの中身を直接変更するのではなく、仮想ノードというものを使って値を定義し、それをVueが自動的にDOMに反映することで値を表示している。ここで出てくる概念が仮想DOMである。
  // 一方でJS(下)では、DOMそのものにアクセスし値を変更している。


  // 仮想DOM:DOMを模したJSオブジェクトのこと
  // DOMにアクセスして変更を加えるときは動きが遅い（ブラウザにアクセスしてとってくる必要がるから）。つまり新しいDOMを作成するのに時間がかかる。
  // DOMを変更するには、変更前のDOMと変更後のDOMの差分をとってそれだけを反映させれば早い。
  // 仮想DOMはDOMと全く同じものをオブジェクトの形で保持することで、DOM特有の動きが遅くなる現象に対応している。
  // Vueでは変更前の仮想DOMと変更後の仮想DOMを保持しておいて、比較し差分をとってそれをDOMに反映することで効率的に処理ができる
  render: function(createElement) {
    console.log(createElement('h1', 'こんにちは' + this.name))
    // createElementをreturnする。第一引数にタグ。第二引数に値を入れることで表示できる
    return createElement('h1', 'こんにちは' + this.name)
  },
}).$mount('#app5')

// div要素を作成するjs
// 検証ツールショートカット コマンド+オプション+ i
// ここではDOMに直接div要素を追加している
// var div = document.createElement('div')
// console.log(dir)

// documentの中身を見ることができる。言い換えればDOMの中身をみれる
// console.log(document)

// DOMの中身をオブジェクト形式で見ることができるconsole.dir()
// オブジェクト形式とはキーバリューの形で表示している形式のこと。
// console.dir(document)

// ライフサイクルの確認
new Vue({
  el: '#app6',
  data: {
    name: '田中'
  },
  beforeCreate: function() {
    console.log('beforeCreate')
  },
  created: function() {
    console.log('created')
  },
  beforeMount: function() {
    console.log('beforeMount')
  },
  mounted: function() {
    console.log('mounted')
  },
  beforeUpdate: function() {
    console.log('beforeUpdate')
  },
  updated: function() {
    console.log('updated')
  },
  beforeDestroy: function() {
    console.log('beforeDestroy')
  },
  destroyed: function() {
    console.log('destroyed')
  },
  methods: {
    destroy: function() {
      // インスタンスを破壊するとvueの機能を停止させる
      return this.$destroy()
    }
  }
})
