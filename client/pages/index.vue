<template>
  <div class="l-client">
    <table class="l-client__table">
      <thead>
        <tr>
          <th>Photo</th>
          <th>Username</th>
          <th>Nickname</th>
          <th>Notifications</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="l-client__table__user"
          v-for="user in usersArray"
          :key="user.id"
        >
          <td class="l-client__table__user__avatar">
            <svg
              width="40" height="32"
              viewBox="0 0 40 32"
              aria-hidden="true"
            >
              <mask id="61df254d-f640-4c3b-b18c-e5d7f28ce21e" width="32" height="32">
                <circle cx="16" cy="16" r="16" fill="#FFFFFF"></circle>
                <rect color="black" x="19" y="19" width="16" height="16" rx="8" ry="8"></rect>
              </mask>
              <foreignObject
                x="0" y="0"
                width="32" height="32"
                mask="url(#61df254d-f640-4c3b-b18c-e5d7f28ce21e)"
              >
                <div>
                  <img
                    :src="user.avatar + '?size=32'"
                    alt="" aria-hidden="true"
                  >
                </div>
              </foreignObject>
              <svg
                x="14.5" y="17"
                v-html="svgDiscordStatus.getAvaSVG(user.presence)"
              ></svg>
              <rect x="22" y="22" width="10" height="10" fill="#000000" aria-hidden="true" fill-opacity="0"></rect>
            </svg>
          </td>
          <td>{{user.user.username}}</td>
          <td>{{user.nickname}}</td>
          <td>
            <div class="l-client__table__user__notify-settings">
              <div
                :class="!(usersSettingsObject[user.user.id] && usersSettingsObject[user.user.id][state]) && 'l-client__table__user__notify-settings__box--disabled'"
                class="l-client__table__user__notify-settings__box"
                v-for="state in status"
                :key="state"
                v-html="svgDiscordStatus.getSVG(state, 16)"
                @click="editSetting(user.user.id, state, usersSettingsObject[user.user.id] ? !usersSettingsObject[user.user.id][state] : true)"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <svg-mask />
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      usersArray: [],
      usersSettingsObject: {},
      status: [
        'online',
        'idle',
        'dnd',
        'offline'
      ],
      svgDiscordStatus: {
        getSVG: (status, size=12) => {
          return `
            <svg
              width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"
            >
              <foreignObject
                x="0" y="0" width="${size}" height="${size}"
                overflow="visible" mask="url(#svg-mask-status-${status})"
              >
                <div
                  class="svg-box-element"
                  style="background-color: ${
                           status === 'online' ? 'hsl(139, 47.3%, 43.9%)' :
                           status === 'idle' ? 'hsl(38, 95.7%, 54.1%)' :
                           status === 'dnd' ? 'hsl(359, 82.6%, 59.4%)' :
                           'hsl(214, 9.9%, 50.4%)'
                  }; width: 100%; height: 100%;"
                  bis_skin_checked="1"
                >
                </div>
              </foreignObject>
            </svg>
          `
        },
        getAvaSVG: (presence) => {
          return `
            <svg width="25" height="15" viewBox="0 0 25 15">
              <mask id="mask-id-${presence ? presence.status : 'default'}">
                <rect x="7.5" y="5" width="10" height="10" rx="5" ry="5" fill="#FFFFFF"></rect>
                <rect
                  ${presence ? presence.status === 'online' ? 'x="12.5" y="10" width="0" height="0" rx="0" ry="0" fill="black"' :
                    presence.status === 'idle' ? 'x="6.25" y="3.75" width="7.5" height="7.5" rx="3.75" ry="3.75" fill="black"' :
                    presence.status === 'dnd' ? 'x="8.75" y="8.75" width="7.5" height="2.5" rx="1.25" ry="1.25" fill="black"' :
                    'x="10" y="7.5" width="5" height="5" rx="2.5" ry="2.5" fill="black"' :
                    'x="10" y="7.5" width="5" height="5" rx="2.5" ry="2.5" fill="black"'}
                ></rect>
                <polygon
                  points="-2.16506,-2.5 2.16506,0 -2.16506,2.5" fill="black"
                  transform="scale(0) translate(13.125 10)" style="transform-origin: 13px 10px 0;"
                ></polygon>
                <circle fill="black" cx="12.5" cy="10" r="0"></circle>
              </mask>
              <rect
                  ${presence ? presence.status === 'online' ? `fill="hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)" width="25" height="15" mask="url(#mask-id-${presence.status})"` :
                  presence.status === 'idle' ? `fill="hsl(38, calc(var(--saturation-factor, 1) * 95.7%), 54.1%)" width="25" height="15" mask="url(#mask-id-${presence.status})"` :
                  presence.status === 'dnd' ? `fill="hsl(359, calc(var(--saturation-factor, 1) * 82.6%), 59.4%)" width="25" height="15" mask="url(#mask-id-${presence.status})"` :
                  `fill="hsl(214, calc(var(--saturation-factor, 1) * 9.9%), 50.4%)" width="25" height="15" mask="url(#mask-id-default)"` :
                  `fill="hsl(214, calc(var(--saturation-factor, 1) * 9.9%), 50.4%)" width="25" height="15" mask="url(#mask-id-default)"`}
              ></rect>
            </svg>
          `
        }
      },
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
    async setMemberSettingsInAPI(id, newData) {
      return await this.$axios.post(`/setMemberSettings/${id}`, newData)
    },
    async getAllMembersFromAPI() {
      return await this.$axios.get('/getMembers')
    },
    async getAllMembersSettingsFromAPI() {
      return await this.$axios.get('/getMembersSettings')
    },

    editSetting(id, statusKey, newStatus) {
      let userSetting = this.usersSettingsObject[id]
      if (!userSetting) {
        userSetting = { [statusKey]: true }
      } else {
        this.$set(userSetting, statusKey, newStatus)
      }
      this.$set(this.usersSettingsObject, id, userSetting)

      Promise.all([
        this.setMemberSettingsInAPI(id, userSetting)
      ])
        .then()
        .catch(err => {
          console.error(new Error('Ошибка отправки данных'))
        })
    }
  }
}
</script>

<style lang="scss">
.l-client {
  display: flex;
  justify-content: center;
  max-width: 700px;
  margin: 0 auto;
  &__table {
    &__user {
      &__avatar {
        & img {
          width: 32px;
        }
      }
      &__notify-settings {
        display: flex;
        justify-content: space-between;
        &__box {
          width: 16px;
          height: 16px;
          cursor: pointer;
          &--disabled {
            & .svg-box-element {
              background-color: rgba(0, 0, 0, 0.7) !important;
            }
          }
        }
      }
    }
  }
}
</style>
