const isOdd = (number) => number % 2;

const _bindCommensali = (items = [], foods = []) => {
    let commensali = [];
    items.forEach(item => {
        const _food = foods.find(cibo => cibo.name === item.food);
        commensali.push({...item, ..._food});
    });
    const pani = commensali.filter(c => c.food === 'panuozzo');

    if (isOdd(pani.length)) {
        const panoIndex = commensali.findIndex(c => c._id === pani[0]._id);
        commensali[panoIndex] = {...commensali[panoIndex], price: 5, only: true};
    }

    return commensali;
};


Vue.use(bootstrapVue);

new Vue({
    el: '#app',
    mixins: [mixin.mixin()],
    data:
        {
            user: new User(),
            form: {
                dataInizio: new Date(),
                dataFine: new Date(),
            },
            items: {
                cibo: [],
                panuozzo: [],
            },
            commensali: {
                items: [],
                type: 2
            },
            selezione: 'cibo',
            foods : window.foodGlobal,
            fieldException: ['_id', 'prenotazioneId', '__v']
        },
    mounted() {
        if (!this.user.logged || !this.user.is(window.User.Type.Admin)) {
            window.location.href = "/";
        }
        this.fetchData();
    },
    methods: {
        getUserRoles() {
            if (!this.user.roles.length) return 'user';
            return this.user.roles.join(',');
        },
        fetchData() {

            const [dataInizio, dataFine] = window.generateStartEnd(this.form.dataInizio, this.form.dataFine);

            Api('data').post('find', {
                query: {date: {$gte: dataInizio, $lt: dataFine}},
                table: "prenotazioneCibo"
            }).then((response) => this.items.cibo = response.data);

            Api('data').post('find', {
                query: {date: {"$gte": dataInizio, "$lt": dataFine}},
                table: "prenotazioni"
            }).then((response) => this.items.panuozzo = response.data);
        },
        showCommensali() {
            this.$refs.modalCommensali.show();
        }
    },
    computed: {
        computedItems() {
            return this.items[this.selezione];
        },
        commensaliList() {
            let {type} = this.commensali;
            let items = _bindCommensali(this.items.cibo, this.foods);

            if (type === 2) return items;

            return items.filter(item => item.type === type);
        }
    },
    watch: {
        form: {
            handler: function () {
                this.fetchData();
            },
            deep: true
        }
    }
});

window.netlifyIdentity.on("logout", () => window.location.href = "/");