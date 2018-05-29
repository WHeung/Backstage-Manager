<template>
    <div>
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>供应商机票库存管理</el-breadcrumb-item>
            <el-breadcrumb-item>所有库存</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="dwf-content">
            <div class="content-top">
                <div class="stock-update">
                    <el-button size="large">新增库存</el-button>
                    <el-button size="large">批量上传</el-button>
                </div>
                <div class="stock-sort">
                    <el-select size="small" value="全部状态">
                        <el-option value="全部状态">全部状态</el-option>
                        <el-option value="上架">上架</el-option>
                        <el-option value="售罄">售罄</el-option>
                        <el-option value="下架">下架</el-option>
                    </el-select>
                    <el-input max="10" placeholder="搜素库存ID" suffix-icon="el-icon-search"></el-input>
                </div>
            </div>
            <div class="button-group">
                <el-button>上架</el-button>
                <el-button>手动下架</el-button>
            </div>
            <div class="stock-table">
                <el-table
                        :data="tableData3"
                        border
                        tooltip-effect="dark"
                        style="width: 100%">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            label="库存ID"
                            width="120">
                        <template slot-scope="scope">{{ scope.row.date }}</template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="出发-到达"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="航司"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="航司"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="航司"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="航司"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="航司"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="航司"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="航司"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="航司"
                            show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {};
        }
    }
</script>
<style lang="stylus">
    .dwf-content
        .content-top
            padding:5px 0;
            display:flex;
            justify-content:space-between;
            .stock-sort
                display:flex;
                align-items:center;
                >.el-select
                    width:140px;
                    margin-right:20px;
                >.el-input
                    width:200px;
                    height:30px;
            .button-group
                .el-button:last-child
                    margin-left:20px;
</style>