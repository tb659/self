const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const router = express.Router()

router.use(multer({ dest: './public/images' }).any())

router.get('/user1', (req, res) => {
  console.log(req.query)
  res.send({ code: '200', data: { method: 'get方法', list: [{ a: 12, b: 24 }] } })
})
router.post('/user2', (req, res) => {
  console.log(req.body)
  res.send({ code: '200', data: { method: 'post方法', list: [{ a: 12, b: 24 }] } })
})
router.put('/user3', (req, res) => {
  console.log(req.body)
  res.send({ code: '200', data: { method: 'put方法', list: [{ a: 12, b: 24 }] } })
})
router.delete('/user4', (req, res) => {
  console.log(req.query)
  res.send({ code: '200', data: { method: 'delete方法', list: [{ a: 12, b: 24 }] } })
})

// 图片上传
router.post('/img', function (req, res) {
  const file = req.files[0]
  console.log(file)
  const oldname = file.filename
  const newname = oldname + path.parse(file.originalname).ext
  fs.renameSync('./public/images/' + oldname, './public/images/' + newname)
  res.send('images/' + newname)
})

// //图片下载
// router.get('/fileName/download', (req, res) => {
//   const img = fs.readFileSync('./public/images')
// })



// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// 导航
router.get('/nav', (req, res) => {
  res.send(nav())
})

// 搜索
router.get('/search', (req, res) => {
  res.send(search())
})

// 首页新闻
router.get('/homeNews', (req, res) => {
  res.send(homeNews())
})

// 视频
router.get('/video', (req, res) => {
  res.send(video())
})

// 服务
router.get('/server', (req, res) => {
  res.send(server())
})

// 链接帮助
router.get('/help', (req, res) => {
  res.send(help())
})

// 新闻列表
router.get('/news', (req, res) => {
  // console.log(req.query)
  res.send(news())
})


// 列表详情
router.get('/newsDetail', (req, res) => {
  // console.log(req.query)
  res.send(newsDetail())
})

// 二级导航
router.get('/minorMenu', (req, res) => {
  // console.log(req.query)
  res.send(minorMenu())
})

// 搜索导航
router.get('/searchList', (req, res) => {
  // console.log(req.query)
  res.send(searchList())
})

// 搜索数据列表
router.get('/searchResult', (req, res) => {
  // console.log(req.query)
  res.send(searchResult())
})

// 搜索数据列表详情
router.get('/searchResultDetail', (req, res) => {
  // console.log(req.query)
  res.send(searchResultDetail())
})

// liuyan 列表
router.get('/messageList', (req, res) => {
  // console.log(req.query)
  res.send(messageList())
})

// liuyan 列表
router.get('/userInfo', (req, res) => {
  // console.log(req.query)
  res.send(userInfo())
})

// log日志 列表
router.get('/logList', (req, res) => {
  // console.log(req.query)
  res.send(logList())
})


// 资料下载
router.get('/dataDown', (req, res) => {
  // console.log(req.query)
  res.send(dataDown())
})


// 资料下载
router.get('/cascader', (req, res) => {
  // console.log(req.query)
  res.send(cascader())
})



module.exports = router



function nav() {
  var res = [
    { id: 1, href: 'index.html', title: '首页' },
    { id: 2, href: 'standInfo.html', title: '标准化信息' },
    { id: 3, href: 'search.html', title: '标准检索' },
    { id: 4, href: 'bzservice.html?orderNo=1', title: '标准托管' },
    { id: 5, href: 'bzservice.html?orderNo=2', title: '标准有效性确认' },
    { id: 6, href: 'laws.html', title: '法律法规' },
    // { id: 6, href: 'interact.html', title: '互动交流' },
    { id: 7, href: 'technical.html', title: '专标委' },
    { id: 8, href: 'groupStd.html', title: '团体标准' },
  ]
  return res
}

function search() {
  var res = [
    { id: 1, title: '全部标准' },
    { id: 2, title: '国家标准' },
    { id: 3, title: '行业标准' },
    { id: 4, title: '地方标准' },
    { id: 5, title: '国际标准' },
    { id: 6, title: '欧盟法规指令' }
  ]
  return res
}

function homeNews() {
  var res = [
    { id: 1, title: '这是是标题这是是标题这是是标题，这是是标题这是是标题' },
    { id: 1, title: '这是是标题这是是标题这是是标题，这是是标题这是是标题' },
    { id: 1, title: '这是是标题这是是标题这是是标题，这是是标题这是是标题' },
    { id: 1, title: '这是是标题这是是标题这是是标题，这是是标题这是是标题' },
    { id: 1, title: '这是是标题这是是标题这是是标题，这是是标题这是是标题' },
    { id: 1, title: '这是是标题这是是标题这是是标题，这是是标题这是是标题' },
    { id: 1, title: '这是是标题这是是标题这是是标题，这是是标题这是是标题' },
    { id: 1, title: '这是是标题这是是标题这是是标题，这是是标题这是是标题' },
    { id: 1, title: '这是是标题这是是标题这是是标题，这是是标题这是是标题' },
    { id: 1, title: '这是是标题这是是标题这是是标题，这是是标题这是是标题' },
    { id: 1, title: '这是是标题这是是标题这是是标题，这是是标题这是是标题' }
  ]
  return res
}

function video() {
  var res = [
    { id: 1, title: '不得不说的PM2.5', cover: 'https://images.pexels.com/photos/4221054/pexels-photo-4221054.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    { id: 1, title: '不得不说的PM2.5', cover: 'https://images.pexels.com/photos/4221054/pexels-photo-4221054.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    { id: 1, title: '不得不说的PM2.5', cover: 'https://images.pexels.com/photos/4221054/pexels-photo-4221054.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    { id: 1, title: '不得不说的PM2.5', cover: 'https://images.pexels.com/photos/4221054/pexels-photo-4221054.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    { id: 1, title: '不得不说的PM2.5', cover: 'https://images.pexels.com/photos/4221054/pexels-photo-4221054.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    { id: 1, title: '不得不说的PM2.5', cover: 'https://images.pexels.com/photos/4221054/pexels-photo-4221054.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
    { id: 1, title: '不得不说的PM2.5', cover: 'https://images.pexels.com/photos/4221054/pexels-photo-4221054.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' }
  ]
  return res
}

function server() {
  var res = [
    { id: 1, title: '标准托管', cover: 'https://images.pexels.com/photos/4221054/pexels-photo-4221054.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', desc: '用户提供的标准号进行托管服务，系统自行检索标准的作废信息，并给用户提示。帮助用户高效率的掌握所关注的标准文献的更替情况，及时使用现行有效的标准。' },
    { id: 2, title: '标准有效性服务', cover: 'https://images.pexels.com/photos/4221054/pexels-photo-4221054.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', desc: '对用户所使用的标准进行检验和证明，并向用户提供权威的标准有效性确认报告，为企业的认证、质量评定及日常标准的使用提供技术保障。' }
  ]
  return res
}

function help() {
  var res = [
    { "id": 14667821, "rn": null, "name": "抗疫情", "position": 1, "orderNo": 1, "descr": null, "content": "<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14664305&amp;type=2\" target=\"_blank\" rel=\"noopener\"><strong>1.医用防护鞋服标准解读</strong></a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14664335&amp;type=2\" target=\"_blank\" rel=\"noopener\">2.口罩、防护、消毒等主要国内相关标准清单</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14662490&amp;type=2\" target=\"_blank\" rel=\"noopener\">3.关于省内具备口罩和防护服等相关检测能力的检验检测机构名单的公告</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14667762&amp;type=1\" target=\"_blank\" rel=\"noopener\">4.安徽省防护服类企业标准简介</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14667689&amp;type=1\" target=\"_blank\" rel=\"noopener\">5.安徽省消毒类企业标准简介</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14667666&amp;type=1\" target=\"_blank\" rel=\"noopener\">6.安徽省口罩类企业标准简介</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14667536&amp;type=1\" target=\"_blank\" rel=\"noopener\">7.【疫情防控】团体标准在行动！</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14667500&amp;type=1\">8.消毒剂标准小课堂</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14661972&amp;type=1\">9. N95、KN95、FFP2口罩到底是啥？和医用口罩区别在哪？&mdash;口罩标准告诉你</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14667782&amp;type=3\">10. 24个国家和地区因疫情对中国货物贸易的限制措施更新</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14667295&amp;type=3\">11. 韩国为应对新冠肺炎疫情，放宽对1次性餐具的使用规定</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14661964&amp;type=3\">12. 针对疫情，金砖国家的重要措施及影响分析&mdash;&mdash;巴西</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14661963&amp;type=3\">13. 针对疫情，金砖国家的重要措施及影响分析&mdash;&mdash;印度</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14661962&amp;type=3\">14. 针对疫情，金砖国家的重要措施及影响分析&mdash;&mdash;俄罗斯</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14661961&amp;type=3\">15. 针对疫情，新加坡的应对措施及影响分析</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14661961&amp;type=3\">16. 韩国为预防新型冠状病毒，将对1800余家线上食品销售企业等进行专项检查</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14661958&amp;type=3\">17. 新型冠状病毒感染肺炎疫情：越南农产品销售方案</a></p>", "itemUrl": null, "showType": 2, "menuType": 1, "flag": 1, "createUsername": null, "createDate": null, "rownum_": null },
    { "id": 7858728, "rn": null, "name": "用户中心", "position": 1, "orderNo": 2, "descr": null, "content": null, "itemUrl": null, "showType": 3, "menuType": 1, "flag": 1, "createUsername": null, "createDate": null, "rownum_": null },
    { "id": 7858731, "rn": null, "name": "联系我们", "position": 1, "orderNo": 3, "descr": null, "content": "<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><span style=\"line-height: 2; font-size: 14px;\">地址：合肥市包河工业园延安路13号</span></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><span style=\"line-height: 2; font-size: 14px;\">邮编：230051</span></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><span style=\"line-height: 2; font-size: 14px;\">联系电话：0551-63356382、0551-63356397</span></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><span style=\"line-height: 2; font-size: 14px;\">工作QQ：861980146(安徽标准馆)</span></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><span style=\"line-height: 2; font-size: 14px;\"><strong>安徽省质量和标准化研究院概况</strong></span></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><span style=\"line-height: 2; font-size: 14px;\">&nbsp; &nbsp; &nbsp; &nbsp;<span style=\"background-color: #fbfcfe;\">安徽省质量和标准化研究院始建于</span>1980<span style=\"background-color: #fbfcfe;\">年，</span>2015<span style=\"background-color: #fbfcfe;\">年</span>2<span style=\"background-color: #fbfcfe;\">月经省编办批准由安徽省标准化研究院更名为安徽省质量和标准化研究院（以下简称&ldquo;省质标院&rdquo;），是安徽省唯一专业从事质量和标准化研究与服务的省级社会公益类科研单位</span><span style=\"background-color: #fbfcfe;\">。</span>省质标院现有办公用房6000余平方米，在职职工近百人，其中标准化、信息化等专业技术人员占90%以上，硕士研究生以上学历占40%以上，高级工程师以上职称占20%。</span></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background: #fbfcfe;\"><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; &nbsp;近年来，省质标院牵头或参与完成了《全国农业标准化示范区管理系统》、《油漆涂料、洗涤用品消费品影响因子的识别、分析与评价研究》、《电线电缆产业应对欧盟环保指令研究与示范》、《体育用品安全、通用标准研究》、《安徽省城乡一体化标准体系明细表》等国家级、省级重大科研项目</span><span style=\"font-size: 14px;\">40</span><span style=\"font-size: 14px;\">余项，市厅级项目</span><span style=\"font-size: 14px;\">20</span><span style=\"font-size: 14px;\">余项。牵头或参与制修订国家、行业、地方标准</span><span style=\"font-size: 14px;\">300</span><span style=\"font-size: 14px;\">多项，其中国家标准</span><span style=\"font-size: 14px;\">50</span><span style=\"font-size: 14px;\">余项，行业标准</span><span style=\"font-size: 14px;\">40</span><span style=\"font-size: 14px;\">余项，帮助各类企业制定企业标准</span><span style=\"font-size: 14px;\">500</span><span style=\"font-size: 14px;\">余项。获国家质检总局&ldquo;科技兴检&rdquo;三等奖、中国标准创新贡献奖三等奖、省质监局&ldquo;科技兴检&rdquo;二等奖、安徽省标准创新贡献奖二等奖、三等奖等。</span></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background: #fbfcfe;\"><span style=\"font-size: 14px;\">&nbsp; &nbsp; &nbsp; 展望未来，省质标院以《质量发展纲要（</span><span style=\"font-size: 14px;\">2011-2020</span><span style=\"font-size: 14px;\">年》、《国务院关于印发深化标准化工作改革方案的通知》、《国家标准化体系建设规划（</span><span style=\"font-size: 14px;\">2016-2020</span><span style=\"font-size: 14px;\">）》等重大机遇，围绕建设完善安徽省标准体系和提高安徽标准化水平两大主题，以实施&ldquo;安徽省技术标准战略&rdquo;为契机，坚持标准研究制定、标准信息服务、标准认证评估、标准技术咨询、标准宣贯培训&ldquo;五位一体，协调发展&rdquo;的总体目标，努力成为全省质量和标准化研究的推动者、技术的引领者、模范实践者和文化的传播者，为社会各界提供及时、有效、专业、权威的质量和标准化专业服务，为决胜全面建成小康社会，建设现代化五大发展美好安徽做出新的更大贡献。</span></p>\n<p class=\"MsoNormal\" style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\">&nbsp;</p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\">&nbsp;</p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\">&nbsp;</p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><span style=\"line-height: 2; font-size: 14px;\"><strong>安徽标准馆概况</strong></span></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><span style=\"line-height: 2; font-size: 14px;\">&nbsp; &nbsp; &nbsp; &nbsp;安徽标准馆拥有省内最全面和权威的标准化资源，自2010年以来，安徽标准馆根据《安徽标准馆十二五规划》，年均投入近100万元，采集纸质和电子版本各有关标准文献、建立标准化信息服务专项平台。截止目前，拥有标准纸质和电子文本共计30余万册，各类标准题录信息130余万条，其中国家和行业标准题录20万左右、安徽省地方标准2000余条，基本覆盖了我省主导优势产业，通过各种标准化信息服务平台为企业、高等院校、科研机构、检测机构以及政府有关部门等提供标准文献检索、查询、交流、应用等服务量年均3万余次。同时利用标准信息资源每年为200多家检验机构出具了标准有效性确认报告，为标准促进我省经济社会发展发挥重要作用。</span></p>", "itemUrl": null, "showType": 2, "menuType": 1, "flag": 1, "createUsername": null, "createDate": null, "rownum_": null },
    { "id": 7858729, "rn": null, "name": "友情提示", "position": 1, "orderNo": 4, "descr": null, "content": "<h1 style=\"margin: 0px; padding: 0px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; text-rendering: optimizelegibility; font-size: 30px; line-height: 36px; background-color: #ffffff; text-indent: 2em;\"><span style=\"font-size: 14px;\"><span style=\"color: #e53333; font-size: 18px;\">&nbsp; 在本站下载的所有标准资料只作为交流学习之用，请勿传播或者其他用途，</span><span style=\"color: #e53333; font-size: 18px;\">正式场合使用请购买正版</span><span style=\"color: #e53333; font-size: 18px;\">！</span></span></h1>", "itemUrl": null, "showType": 2, "menuType": 1, "flag": 1, "createUsername": null, "createDate": null, "rownum_": null },
    { "id": 7858730, "rn": null, "name": "资料下载", "position": 1, "orderNo": 5, "descr": null, "content": "<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=14679678&amp;type=2\">安徽省地方标准报批材料相关文件模板</a></p>\n<p style=\"margin: 0px 0px 9px; padding: 0px; color: #333333; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; background-color: #ffffff;\"><a style=\"text-decoration-line: none; color: #0088cc;\" href=\"http://bzxx.ahbz.org.cn/show.html?flaglogin=0&amp;id=12351098&amp;type=2\">安徽省专业标准化技术委员会名单目录</a></p>", "itemUrl": null, "showType": 2, "menuType": 1, "flag": 1, "createUsername": null, "createDate": null, "rownum_": null }, { "id": 1296, "rn": null, "name": "123", "position": 1, "orderNo": 123, "descr": null, "content": "<p>123321231231231</p>", "itemUrl": null, "showType": 3, "menuType": 1, "flag": 1, "createUsername": null, "createDate": null, "rownum_": null }]
  return res
}

function news() {
  var res = {
    data: [
      { id: 11, title: '这是标题这是标题这是标题这是标题这是标题这是标题', date: '2020-02-02' },
      { id: 12, title: '这是标题这是标题这是标题这是标题这是标题这是标题', date: '2020-02-02' },
      { id: 13, title: '这是标题这是标题这是标题这是标题这是标题这是标题', date: '2020-02-02' },
      { id: 14, title: '这是标题这是标题这是标题这是标题这是标题这是标题', date: '2020-02-02' },
      { id: 15, title: '这是标题这是标题这是标题这是标题这是标题这是标题', date: '2020-02-02' },
      { id: 16, title: '这是标题这是标题这是标题这是标题这是标题这是标题', date: '2020-02-02' },
      { id: 17, title: '这是标题这是标题这是标题这是标题这是标题这是标题', date: '2020-02-02' },
      { id: 18, title: '这是标题这是标题这是标题这是标题这是标题这是标题', date: '2020-02-02' },
      { id: 19, title: '这是标题这是标题这是标题这是标题这是标题这是标题', date: '2020-02-02' },
      { id: 111, title: '这是标题这是标题这是标题这是标题这是标题这是标题', date: '2020-02-02' },
    ],
    total: 123
  }
  return res
}

function newsDetail() {
  var res = {
    desc: `</p> <p><span><span style="font-size: 13.3333px; background-color: #ffffff;">&nbsp; &nbsp; &nbsp; &nbsp;这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span></span></p> <p><span><span style="font-size: 13.3333px; background-color: #ffffff;">&nbsp; &nbsp; &nbsp; &nbsp;这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span><span style="background-color: #ffffff; font-size: 13.3333px;">这是段落，</span></span></p> <p>&nbsp;</p> <p><span style="background-color: #ffffff; color: #000000; font-size: 13.3333px;">信息来源：某某合作总社</span></p>`,
    fileName: '茶叶企业复工妇产疫情防控工作.pdf',
    title: '这是标题，这是标题，这是标题，这是标题，这是标题，这是标题，这是标题',
    pubDate: '2020-02-02'
  }
  return res
}

function minorMenu() {
  var menuList = [
    {
      name: '标准化信息',
      id: 1,
      childNode: [
        {
          name: '标准公告',
          id: 2,
          href: 'standInfo.html',
        },
        {
          name: 'WTO/TBT新闻',
          id: 3,
          href: 'standInfo.html',
        },
        {
          name: '标准水平评价',
          id: 1,
          href: 'standInfo.html',
        },
      ]
    },
    {
      name: '标准服务',
      id: 2,
      href: '',
      childNode: [
        {
          name: '标准托管',
          id: 21,
          href: 'bzservice.html?orderNo=1',
        },
        {
          name: '标准有效性确认',
          id: 22,
          href: 'bzservice.html?orderNo=2',
        }
      ]
    },
    {
      name: '法律法规',
      id: 3,
      href: '',
      childNode: [
        {
          name: '法律法规',
          id: 31,
          href: 'laws.html',
        }
      ]
    },
    // {
    //   name: '互动留言',
    //   id: 4,
    //   href: '',
    //   childNode: [
    //     {
    //       name: '在线留言',
    //       id: 41,
    //       href: 'interact.html',
    //     },
    //     {
    //       name: '查看留言',
    //       id: 42,
    //       href: 'interact.html',
    //     }
    //   ]
    // },
  ]
  return menuList
}

function searchList() {
  var searchList = [
    {
      name: '模糊搜索',
      id: 1,
      childNode: []
    },
    {
      name: '精确搜索',
      id: 2,
      childNode: [
        {
          name: '国家标准',
          id: 21,
        },
        {
          name: '行业标准',
          id: 22,
        },
        {
          name: '地方标准',
          id: 23,
        },
        {
          name: '国际标准',
          id: 24,
        },
        {
          name: '欧盟法规指令',
          id: 25,
        }
      ]
    },
    {
      name: '分类搜索',
      id: 3,
      childNode: [
        {
          name: '国际标准分类',
          id: 31,
        },
        {
          name: '中国标准分类',
          id: 32,
        }
      ]
    },
  ]
  return searchList
}

function searchResult() {
  var res = {
    data: [
      {
        id: 1,
        standNum: 'gb/t230.2-2002',
        standName: '这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称',
        standStatus: 1,
        down: 1
      }, {
        id: 1,
        standNum: 'gb/t230.2-2002',
        standName: '这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称',
        standStatus: 1,
        down: 0
      }, {
        id: 1,
        standNum: 'gb/t230.2-2002',
        standName: '这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称',
        standStatus: 1,
        down: 1
      }, {
        id: 1,
        standNum: 'gb/t230.2-2002',
        standName: '这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称这是名称',
        standStatus: 0,
        down: 1
      }
    ],
    total: 123
  }
  return res
}


function searchResultDetail() {
  var res = {
    standNum: 'gb/t230.2-2002',
    cnName: '这是中文名称',
    enName: '这是英文名称',
    pubYear: '2020',
    materialDate: '2020-02-02',
    pageNum: 12,
    rangeUse: '这是适用范围，这是适用范围，这是适用范围，这是适用范围，这是适用范围',
    standRelevance: ['gb/t230.2-2002', 'gb/t230.2-2002'],
    cnClassify: 'N71',
    inClassify: '19.060%77.040.10',
    down: 1,
    standStatus: 1
  }
  return res
}

function messageList() {
  var res = {
    data: [
      { title: '这是标题', id: 1, leaveUser: '留言人', leaveDate: '2020-02-02', reply: 0, info: '这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，' },
      { title: '这是标题', id: 1, leaveUser: '留言人', leaveDate: '2020-02-02', reply: 0, info: '这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，' },
      { title: '这是标题', id: 1, leaveUser: '留言人', leaveDate: '2020-02-02', reply: 1, info: '这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，' },
      { title: '这是标题', id: 1, leaveUser: '留言人', leaveDate: '2020-02-02', reply: 1, info: '这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，' },
      { title: '这是标题', id: 1, leaveUser: '留言人', leaveDate: '2020-02-02', reply: 0, info: '这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，' },
      { title: '这是标题', id: 1, leaveUser: '留言人', leaveDate: '2020-02-02', reply: 0, info: '这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，' },
      { title: '这是标题', id: 1, leaveUser: '留言人', leaveDate: '2020-02-02', reply: 1, info: '这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，' },
      { title: '这是标题', id: 1, leaveUser: '留言人', leaveDate: '2020-02-02', reply: 1, info: '这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，' },
      { title: '这是标题', id: 1, leaveUser: '留言人', leaveDate: '2020-02-02', reply: 1, info: '这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，' },
      { title: '这是标题', id: 1, leaveUser: '留言人', leaveDate: '2020-02-02', reply: 1, info: '这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，这是留言内容，' }
    ],
    total: 123
  }
  return res
}

function userInfo() {
  var res = {
    userType: '1',
    ogztName: '机构名称',
    ogztCode: '24/345f/sadf',
    ogztType: '个体',
    ogztAddr: '南京',
    postCode: 236400,
    legalPererson: '某某',
    concact: '010-65432131',
    email: '13@163.com',
    phone: 15646431222,
    userStatus: 1
  }
  return res
}

function logList() {
  var res = {
    data: [
      { num: 1, editor: 'admin', ipAddr: '192.168.1.1', type: '2', action: '管理员登陆了后台管理系统', time: '2020-02-02 02:02:02' },
      { num: 1, editor: 'admin', ipAddr: '192.168.1.1', type: '2', action: '管理员登陆了后台管理系统', time: '2020-02-02 02:02:02' },
      { num: 1, editor: 'admin', ipAddr: '192.168.1.1', type: '2', action: '管理员登陆了后台管理系统', time: '2020-02-02 02:02:02' },
      { num: 1, editor: 'admin', ipAddr: '192.168.1.1', type: '2', action: '管理员登陆了后台管理系统', time: '2020-02-02 02:02:02' },
      { num: 1, editor: 'admin', ipAddr: '192.168.1.1', type: '2', action: '管理员登陆了后台管理系统', time: '2020-02-02 02:02:02' },
      { num: 1, editor: 'admin', ipAddr: '192.168.1.1', type: '2', action: '管理员登陆了后台管理系统', time: '2020-02-02 02:02:02' },
      { num: 1, editor: 'admin', ipAddr: '192.168.1.1', type: '2', action: '管理员登陆了后台管理系统', time: '2020-02-02 02:02:02' },
      { num: 1, editor: 'admin', ipAddr: '192.168.1.1', type: '2', action: '管理员登陆了后台管理系统', time: '2020-02-02 02:02:02' },
      { num: 1, editor: 'admin', ipAddr: '192.168.1.1', type: '2', action: '管理员登陆了后台管理系统', time: '2020-02-02 02:02:02' },
      { num: 1, editor: 'admin', ipAddr: '192.168.1.1', type: '2', action: '管理员登陆了后台管理系统', time: '2020-02-02 02:02:02' }
    ],
    total: 123
  }
  return res
}

function dataDown() {
  var res = {
    data: [
      { id: 1, title: '下载资料下载料下载资料下载' },
      { id: 1, title: '资料下载资料下载下载资料下载资料下载' },
      { id: 1, title: '资料下载资资料下载资料下载资料下载资料下载' },
      { id: 1, title: '载资料下载资料下载资料下载资料下载' },
      { id: 1, title: '资料下资料下载资下载资料下载资料下载资料下载资料下载料下载资料下载' },
      { id: 1, title: '资料下载资料下载资料下载资料下资料下载资料下载' },
      { id: 1, title: '资料下载资载资料下载资料下载资料下载资料下载' },
      { id: 1, title: '资料下载资下载资料下载资料下载资料下载资料下载资料下载' }
    ],
    total: 123
  }
  return res
}



function cascader() {
  var res = data = [
    {
      value: 'A',
      label: 'a',
      children: [
        {
          value: 'AA1',
          label: 'aa1',
        },
        {
          value: 'BB1',
          label: 'bb1'
        }
      ]
    },
    {
      value: 'B',
      label: 'b',
      children: [
        {
          value: 'AA2',
          label: 'aa2',
          children: [
            {
              value: 'AAA3',
              label: 'aaa3',
              children: [
                {
                  value: 'AAA3',
                  label: 'aaa3',
                  children: [
                    {
                      value: 'AAA3',
                      label: 'aaa3',
                    },
                    {
                      value: 'BBB3',
                      label: 'bbb3'
                    }
                  ]
                }
              ]
            },
            {
              value: 'BBB3',
              label: 'bbb3'
            }
          ]
        },
        {
          value: 'BB2',
          label: 'bb2',
          children: [
            {
              value: 'AAA4',
              label: 'aaa4',
            },
            {
              value: 'BBB4',
              label: 'bbb4'
            }
          ]
        }
      ]
    },
    {
      value: 'C',
      label: 'c',
    }
  ]
  return res
}