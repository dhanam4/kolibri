<template>

  <div>

    <h3>{{ $tr('searchPageHeader') }}</h3>

    <SearchBox />

    <p v-if="!searchTerm">{{ $tr('noSearch') }}</p>

    <template v-else>
      <h1 class="search-results">{{ $tr('showingResultsFor', { searchTerm }) }}</h1>

      <p v-if="contents.length === 0">{{ $tr('noResultsMsg', { searchTerm }) }}</p>

      <ContentCardGroupGrid
        v-else
        :genContentLink="genContentLink"
        :contents="searchContents"
        :showContentKindFilter="true"
        :showChannelFilter="true"
      />

    </template>

  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import { ContentNodeKinds } from 'kolibri.coreVue.vuex.constants';
  import sortBy from 'lodash/sortBy';
  import { PageNames } from '../constants';
  import ContentCard from './ContentCard';
  import ContentCardGroupGrid from './ContentCardGroupGrid';
  import SearchBox from './SearchBox';

  export default {
    name: 'SearchPage',
    $trs: {
      searchPageHeader: 'Search',
      noSearch: 'Search by typing in the box above',
      showingResultsFor: "Results for '{searchTerm}'",
      noResultsMsg: "No results for '{searchTerm}'",
      documentTitle: 'Search',
    },
    metaInfo() {
      return {
        title: this.$tr('documentTitle'),
      };
    },
    components: {
      ContentCard,
      ContentCardGroupGrid,
      SearchBox,
    },
    computed: {
      ...mapState('search', ['contents', 'searchTerm']),
      searchContents() {
        return sortBy(this.contents, content => content.channel_id !== content.content_id);
      },
    },
    methods: {
      genContentLink(contentId, contentKind) {
        if (contentKind === ContentNodeKinds.TOPIC || contentKind === ContentNodeKinds.CHANNEL) {
          return {
            name: PageNames.TOPICS_TOPIC,
            params: {
              id: contentId,
            },
          };
        }
        return {
          name: PageNames.TOPICS_CONTENT,
          params: {
            id: contentId,
          },
        };
      },
    },
  };

</script>


<style lang="scss" scoped>

  .search-results {
    margin-top: 32px;
  }

  .search-channel {
    font-size: smaller;
  }

</style>
