<template>
  <div class="l-client">
    <table class="l-client__table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Nickname</th>
          <th>Notifications</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in usersArray"
          :key="user.id"
        >
          <td>{{user.user.username}}</td>
          <td>{{user.nickname}}</td>
          <td>
            <div class="l-client__table__bumbles-notify">
              <div
                class="l-client__table__bumbles-notify__bumble"
                v-for="(state, index) in Object.keys(status)"
                :key="index"
                :style="`color: ${status[state].color}; ${status[state].rotate ? `transform: rotate(${status[state].rotate})` : ''}`"
              >
                <lfa :icon="status[state].icon"></lfa>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      usersArray: [],
      usersSettingsObject: {},
      status: {
        online: {
          color: '#3ba55d',
          icon: 'circle'
        },
        idle: {
          color: '#faa81a',
          icon: 'moon',
          rotate: '250deg'
        },
        dnd: {
          color: '#ed4245',
          icon: 'minus-circle'
        },
        offline: {
          color: '#737e8c',
          icon: 'circle'
        }
      }
    }
  },
  mounted() {
    Promise.all([
      this.getAllMembersFromAPI(),
      this.getAllMembersSettingsFromAPI()
    ]).then(res => {
      this.usersArray = res[0].data
      this.usersSettingsObject = res[1].data
    }).catch(err => {
      console.error(err)
    })
  },
  methods: {
    async setMemberSettingsInAPI() {
      return await this.$axios.post('/setMemberSettings/123', { test: 1, test_qs: 2 })
    },
    async getAllMembersFromAPI() {
      return await this.$axios.get('/getMembers')
    },
    async getAllMembersSettingsFromAPI() {
      return await this.$axios.get('/getMembersSettings')
    }
  }
}
</script>

<style lang="scss">
.l-client {
  &__table {
    &__bumbles-notify {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &__bumble {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        border-radius: 100%;
      }
    }
  }
}
</style>
