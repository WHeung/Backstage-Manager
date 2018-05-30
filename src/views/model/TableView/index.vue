<template>
  <div :class="$style.main">
    <Table :info="list"></Table>
  </div>
</template>

<script>
import Table from './table.vue'
import data from '~src/data'
export default {
  name: 'table-view',
  data () {
    return {
      list: data.modelTable.data
    }
  },
  components: { Table }
}
</script>

<style lang="stylus" module>

</style>
