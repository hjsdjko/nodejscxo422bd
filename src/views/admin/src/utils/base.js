const base = {
    get() {
        return {
            url : "http://localhost:8080/nodejscxo422bd/",
            name: "nodejscxo422bd",
            // 退出到首页链接
            indexUrl: 'http://localhost:8080/nodejscxo422bd/front/dist/index.html'
        };
    },
    getProjectName(){
        return {
            projectName: "基于node的在线教育平台"
        } 
    }
}
export default base
