const Page = require("sf-core/ui/page");
const extend = require("js-base/core/extend");
const Button = require('sf-core/ui/button');
const Label = require('sf-core/ui/label');
const Picker = require("sf-core/ui/picker");
const Color = require('sf-core/ui/color');
const Font = require('sf-core/ui/font');
const FlexLayout = require('sf-core/ui/flexlayout');
const Application = require('sf-core/application');
const ImageView = require('sf-core/ui/imageview');
const items = [ //Text values(Cities) of the picker
    "Adana", "Adıyaman", "Afyon",
    "Ağrı", "Amasya", "Ankara",
    "Antalya", "Artvin", "Aydın",
    "Balıkesir", "Bilecik", "Bingöl",
    "Bitlis", "Bolu", "Burdur", "Bursa",
    "Çanakkale", "Çankırı", "Çorum",
    "Denizli", "Diyarbakır", "Edirne",
    "Elazığ", "Erzincan", "Erzurum",
    "Eskişehir", "Gaziantep", "Giresun",
    "Gümüşhane", "Hakkari", "Hatay", "Isparta",
    "Mersin", "İstanbul", "İzmir", "Kars",
    "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
    "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
    "K.maraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde",
    "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas",
    "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak",
    "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
    "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır",
    "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

var Page1 = extend(Page)(
    function(_super) {
        _super(this, {
            onShow: function(params) {
                Application.statusBar.visible = false;
                this.headerBar.visible = false; //For Android
            }
        });
        this.layout.flexDirection = FlexLayout.FlexDirection.COLUMN;
        this.layout.justifyContent = FlexLayout.JustifyContent.CENTER;
        this.layout.alignItems = FlexLayout.AlignItems.CENTER;
        var index = 0;
        
        var myImageViewMain = new ImageView({  // ImageViews for Main Page images
            image: "images://weatapp.png",
            marginTop:10,
            width: 300,
            height: 250
        });
        var myImageView = new ImageView({
            image: "images://thunderbolt.png",
            marginTop:10,
            width: 50,
            height: 50
        });
        var myImageView2 = new ImageView({
            image: "images://sunny.png",
            marginTop:10,
            width: 50,
            height: 50
        });
        var myImageView3 = new ImageView({
            image: "images://wind.png",
            marginTop:10,
            width: 50,
            height: 50
        });
        this.layout.addChild(myImageViewMain);
        this.layout.addChild(myImageView);
          this.layout.addChild(myImageView2);
            this.layout.addChild(myImageView3);
              
        const lblSelection = new Label({
            text: "",
            font: Font.create("TimesNewRomanPS-BoldMT", 30),
            height: 40
        });


        const btnPick = new Button({        //City Picker
            text: "Şehir Seç",
            borderRadius: 20,
            backgroundColor: Color.create("#FF0000"),
            onPress: btnPickOnPress.bind(this),
            height: 60,
            width: 100

        });
        var myButton = new Button({      //Confirm Button
            marginTop: 50,
            height: 50,
            width: 200,
            borderRadius: 20,
            onPress: myButtonPress.bind(this),
            text: "Hava Durumu Listele",
            textColor: Color.BLACK,
            backgroundColor: Color.create("#00A1F1"),
        });
        this.layout.addChild(lblSelection);
        this.layout.addChild(btnPick);
        this.layout.addChild(myButton);

        function myButtonPress() {   
            if (lblSelection.text === "") {
                alert("Lütfen Seçim Yapınız!");
            }
            else {
                this.router.push("/pages/page2", { message: lblSelection.text }); // if user select a city, takes the data and transfer it to page2
            }
        }

        function btnPickOnPress() {
            console.log(`Showing the picker with index ${index}`);
            const itemPicker = new Picker({
                items: items,
                currentIndex: index //restores previous selection
            });
            itemPicker.show(okCallback, cancelCallback);
        }

        function okCallback(params) {
            console.log('ok clicked');
            index = params.index;
            lblSelection.text = items[params.index];
            btnPick.text = items[params.index];

        }

        function cancelCallback() {
            console.log('cancel clicked');
        }
    }
);
module.exports = Page1;
