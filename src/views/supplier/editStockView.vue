<template>
  <div class="flight-edit" v-loading="loading" element-loading-text="保存中...">
    <el-form :label-position="right" label-width="100px" :rules="rules" ref="provider"  :model="provider">
      <div class="flight-wp">
        <el-form-item label="库存ID:">
          <el-col :span="7" >
            <el-input class="no-class" disabled v-if="provider.id" :value="provider.id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label-width="20px">
          <el-radio-group v-model="provider.roundTrip">
            <el-radio label="YES">往返</el-radio>
            <el-radio label="NO">单程</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="含税总价:" prop="price" :rules="rules.number">
          <el-col :span="7">
            <el-input v-model.number="provider.price"></el-input>
          </el-col>
          <el-col :span="6" :offset="1">
            元
          </el-col>
        </el-form-item>
        <el-form-item label="总位数:" prop="stock.total" :rules="rules.number">
          <el-col :span="7">
            <el-input v-model.number="provider.stock.total"></el-input>
          </el-col>
          <el-col :span="6" :offset="1" v-if="provider.id">
            <span>已售 :{{provider.stock.sold}}</span> <span>剩余 :{{provider.stock.sale}}</span>
          </el-col>
        </el-form-item>
        <el-form-item label="供应商:" :rules="rules.required" prop="company">
          <el-col :span="7">
            <el-select placeholder="请选择票源的供应商" v-model="provider.company">
              <el-option :value="option.name" v-for="(option, index) in options" :key="index">{{option.name}}</el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </div>
    </el-form>
    <p class="line">去程航班详情</p>
    <el-form :label-position="right" label-width="120px" :rules="rules" ref="flight[0]"  :model="flight[0]">
      <div class="flight-wp">
        <el-row>
          <el-col :span="12">
            <el-form-item label="航空公司代码:" prop="companyNo" :rules="rules.required">
              <el-col :span="9">
                <el-input v-model="flight[0].companyNo"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航班号:" prop="flightNo" :rules="rules.required">
              <el-col :span="9">
                <el-input v-model="flight[0].flightNo"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出发机场代码:" prop="onAirportNo" :rules="rules.airportNo">
              <el-col :span="9">
                <el-input placeholder="三字代码,HKG" v-model="flight[0].onAirportNo"></el-input>
              </el-col>
              <p class="note-text">机场名称：{{flight[0].onAirport}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到达机场代码:" prop="offAirportNo" :rules="rules.airportNo">
              <el-col :span="9">
                <el-input placeholder="三字代码,HKG" v-model="flight[0].offAirportNo"></el-input>
              </el-col>
              <p class="note-text">机场名称：{{flight[0].offAirport}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="出发时间:" prop="onTime" :rules="rules.required">
              <el-date-picker type="datetime" v-model="flight[0].onTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col  :span="6" :offset="6">
            <el-form-item label="到达时间:" prop="offTime" :rules="rules.required">
              <el-date-picker type="datetime" v-model="flight[0].offTime"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="flight-direct">
            <p><el-button type="text" @click="toggleStock('go')">{{goDirect?"删除":"新增"}}去程中转航班</el-button></p>
            <div v-if="goDirect">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="抵达转机机场时间:" label-width="120px" prop="transfer.onTime" :rules="rules.required">
                            <el-date-picker type="datetime" v-model="flight[0].transfer.onTime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col  :span="6" :offset="6">
                        <el-form-item label="转机出发时间:" prop="transfer.offTime" :rules="rules.required">
                            <el-date-picker type="datetime" v-model="flight[0].transfer.offTime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="中转机场代码:" label-width="120px" prop="transfer.airportNo" :rules="rules.airportNo">
                            <el-col :span="9">
                                <el-input placeholder="三字代码,HKG" v-model="flight[0].transfer.airportNo"></el-input>
                            </el-col>
                            <p class="note-text">机场名称：{{flight[0].transfer.airport}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="航班号:" prop="transfer.flightNo" :rules="rules.required">
                            <el-col :span="9">
                                <el-input v-model="flight[0].transfer.flightNo"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </div>
      </div>
    </el-form>
    <p class="line">返程航班详情</p>
    <el-form :label-position="right" label-width="120px" :rules="rules" ref="flight[1]"  :model="flight[1]">
      <div class="flight-wp">
        <el-row>
          <el-col :span="12">
            <el-form-item label="航空公司代码:">
              <el-col :span="9">
                <el-input v-model="flight[1].companyNo"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航班号:">
              <el-col :span="9">
                <el-input v-model="flight[1].flightNo"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出发机场代码:">
              <el-col :span="9">
                <el-input placeholder="三字代码,HKG" v-model="flight[1].onAirportNo"></el-input>
              </el-col>
              <p class="note-text">机场名称：{{flight[1].onAirport}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到达机场代码:">
              <el-col :span="9">
                <el-input placeholder="三字代码,HKG" v-model="flight[1].offAirportNo"></el-input>
              </el-col>
              <p class="note-text">机场名称：{{flight[1].offAirport}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出发时间:">
              <el-date-picker type="datetime" v-model="flight[1].onTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col  :span="12">
            <el-form-item label="到达时间:">
              <el-date-picker type="datetime" v-model="flight[1].offTime"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="flight-direct">
          <p><el-button type="text" @click="toggleStock('back')">{{backDirect?"删除":"新增"}}返程中转航班</el-button></p>
          <div v-if="backDirect">
            <el-row>
              <el-col :span="6">
                <el-form-item label="抵达转机机场时间:" label-width="120px" prop="transfer.onTime" :rules="rules.required">
                  <el-date-picker type="datetime" v-model="flight[1].transfer.onTime"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col  :span="6" :offset="6">
                <el-form-item label="转机出发时间:" prop="transfer.offTime" :rules="rules.required">
                  <el-date-picker type="datetime" v-model="flight[1].transfer.offTime"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="中转机场代码:" label-width="120px" prop="transfer.airportNo" :rules="rules.airportNo">
                  <el-col :span="9">
                    <el-input placeholder="三字代码,HKG" v-model="flight[1].transfer.airportNo"></el-input>
                  </el-col>
                  <p class="note-text">机场名称：{{flight[1].transfer.airport}}</p>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="航班号:" prop="transfer.flightNo" :rules="rules.required">
                  <el-col :span="9">
                    <el-input v-model="flight[1].transfer.flightNo"></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-form>
    <div class="flight-wp">
      <el-button type="primary" @click="submit('provider','flight[0]','flight[1]')">&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
      <el-button @click="reset">&nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
    </div>

  </div>
</template>
<script>
  import axios from 'axios'
  export default{
    data () {
        let data = {
            provider:{
                id:null,
                price:null,
                stock:{
                    total:null,
                    sold:null,
                    sale:null
                },
                roundTrip:"YES",
                company:"",
            },
            flight:[
                {
                    "company":"","companyNo":'',
                    "onTime":null,
                    "offTime":null,
                    "costTime":null,
                    "costTimeStr":"",
                    "onAirport":"","onAirportNo":"",
                    "offAirport":"","offAirportNo":"",
                    "flightNo":"","id":null,
                    "transferCity":"","transferStayTimeStr":"",
                    "transfer":{
                        "companyId":null,"companyName":"",
                        "costTime":null,"costTimeStr":"",
                        "flightNo":"",
                        "airportNo":"","airport":"",
                        "onTime":null,"offTime":null,
                        "offTimeHmStr":"","offTimeStr":"",
                        "onTimeHmStr":"","onTimeStr":"",
                        "fromLoc":"","toLoc":""
                    }
                },
                {
                    "company":"","companyNo":'',
                    "onTime":null,
                    "offTime":null,
                    "costTime":null,
                    "costTimeStr":"",
                    "onAirport":"","onAirportNo":"",
                    "offAirport":"","offAirportNo":"",
                    "flightNo":"","id":null,
                    "transferCity":"","transferStayTimeStr":"",
                    "transfer":{
                        "companyId":null,"companyName":"",
                        "costTime":null,"costTimeStr":"",
                        "flightNo":"",
                        "airportNo":"","airport":"",
                        "onTime":null,"offTime":null,
                        "offTimeHmStr":"","offTimeStr":"",
                        "onTimeHmStr":"","onTimeStr":"",
                        "fromLoc":"","toLoc":""
                    }
                }
            ],
            options:null
        };
        return {
            provider:data.provider,
            flight:data.flight,
            options:data.options,
            rules:{
                number:[
                    {type:"number",required:true,message:"必须为数字",trigger: 'blur'}
                ],
                required:[
                    {required:true,message:"不能为空"}
                ],
                airportNo:[
                    {required:true,message:'不能为空'},
                    { min: 3, max: 3, message: '需为3字代码', trigger: 'blur' }
                ]
            },
            goDirect:false,
            backDirect:false,
            loading:false
        };
    },
    props: {
    },
    created () {
        axios.request({
            method: 'post',
            url: '../channel/provider',
        }).then((res)=>{this.options = res.data.data.options})

        if(Number(this.$route.params.id)){
            axios.request({
                url: '../channel/data',
                data:this.$route.params,
                method:"post"
            }).then((res)=>{
                let result = res.data
                if(result && result.code!=null){
                    if (result.code === 0) {
                        let provider = result.data.provider;
                        let flight = result.data.flight;
                        if(flight[0].transfer) {
                            this.goDirect = true;
                        }else{
                            flight[0].transfer = {}
                        }
                        if(flight[1].transfer) {
                            this.backDirect = true;
                        }else{
                            flight[1].transfer = {}
                        }
                        this.provider  = provider;
                        this.flight = flight;
                    } else {
                        this.$alert( result.data.word, {
                            confirmButtonText: '我知道了',
                        });
                    }
                }
            })
        }
    },
    beforeMount () {
    },
    mounted () {
    },
    methods: {
        toggleStock:function(type){
            if(type==='go')
                this.goDirect=!this.goDirect;
            else
                this.backDirect=!this.backDirect;
        },
        reset:function(){
            this.$refs['provider'].resetFields();
            this.$refs['flight[0]'].resetFields();
            this.$refs['flight[1]'].resetFields();
        },
        submit:function(provider,flight1,flight2){
            if(this.loading) return;
            var submit = true;
            this.$refs[provider].validate((valid) => {
                if (!valid) {
                    submit = false;
                    return false;
                }
            });
            this.$refs[flight1].validate((valid) => {
                if (!valid) {
                    submit = false;
                    return false;
                }
            });
            this.$refs[flight2].validate((valid) => {
                if (!valid) {
                    submit = false;
                    return false;
                }
            });
            if(submit){
                let data={
                    provider:this.provider,
                    flight:this.flight
                }
                !this.goDirect && (data.flight[0].transfer=null)
                !this.backDirect && (data.flight[1].transfer=null)
                this.loading = true
                $.ajax({
                    data:JSON.stringify(data),
                    url:"../channel/save",
                    type:'POST',
                    dataType:'json',
                    success:(res)=>{
                        if(res.code!=null){
                            this.$alert( res.data.word, {
                                confirmButtonText: '我知道了',
                            });
                            if(res.code === 0){
                                this.reset();
                            }
                        }
                    },
                    complete:()=>{
                        this.loading=false
                    }
                })
            }

        },
    }
  }
</script>
<style lang="stylus">
    .no-class input
        border:0 !important;
        background:transparent !important;
        color:#000 !important;
        cursor:auto !important;
    .flight-edit
        padding:20px;
        .line
            font-family: 'Arial-BoldMT', 'Arial Bold', 'Arial';
            font-weight: 700;
            font-style: normal;
            font-size: 16px;
            color: #0000CC;
            padding: 0 20px 0;
            line-height: 2px;
            border-left: 300px solid #0000CC;
            border-right: 300px solid #0000CC;
            text-align: center;
        .note-text
            display:inline;
            margin-left:5%;
        .flight-wp
            padding:20px 0;

</style>
