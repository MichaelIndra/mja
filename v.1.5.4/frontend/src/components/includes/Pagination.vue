<template>
  <v-pagination
    class="mt-5"
    :disabled="loading"
    v-model="pagination.page"
    :length="pagination.length"
    :page="pagination.page"
    :total-visible="pagination.totalVisible"
  ></v-pagination>
</template>
<script src="./pagination.ts"></script>