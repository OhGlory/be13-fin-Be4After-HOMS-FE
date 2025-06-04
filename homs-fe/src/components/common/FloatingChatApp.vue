<template>
  <div class="fixed bottom-6 right-6 z-50">
    <button
      @click="toggleChat"
      :disabled="!currentUserId"
      class="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white p-4 rounded-full shadow-lg focus:outline-none disabled:cursor-not-allowed focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-all duration-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.508 12.27 2 11.104 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9a1 1 0 100 2h6a1 1 0 100-2H7z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <Transition name="chat-slide-fade">
      <div
        v-if="isOpen"
        class="fixed bottom-22 right-6 w-80 md:w-[600px] h-[80vh] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
      >
        <div class="bg-orange-500 text-white p-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">채팅</h3>
          <button @click="toggleChat" class="text-white hover:text-gray-200 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex flex-1 overflow-hidden">
          <div class="w-1/3 border-r border-gray-200 flex flex-col">
            <button
              @click="openCreateRoomPrompt"
              class="m-2 p-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors focus:outline-none"
            >
              + 새 채팅방 만들기
            </button>
            <div class="flex-1 overflow-y-auto">
              <div
                v-for="chatRoom in chatRooms"
                :key="chatRoom.id"
                @click="selectChatRoom(chatRoom.id)"
                :class="{
                  'bg-orange-100 border-l-4 border-orange-500': selectedChatRoomId === chatRoom.id,
                  'hover:bg-gray-50': selectedChatRoomId !== chatRoom.id
                }"
                class="p-3 cursor-pointer transition-colors duration-200"
              >
                <p class="font-semibold text-gray-800 truncate">{{ chatRoom.name }}</p>
                <p class="text-sm text-gray-500 truncate">{{ chatRoom.lastMessage }}</p>
              </div>
            </div>
          </div>

          <div class="w-2/3 flex flex-col">
            <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div v-if="roomId">
                <div
                  v-for="(msg, idx) in messages"
                  :key="idx"
                  class="mb-3 flex flex-col max-w-[70%]"
                  :class="msg.senderId.toString() === currentUserId ? 'ml-auto items-end' : 'mr-auto items-start'"
                >
                  <span class="text-xs text-gray-500 mb-1">
                    {{ msg.senderId.toString() === currentUserId ? '나' : getOtherUserName(msg.senderId) }}
                  </span>
                  <div
                    class="relative px-3 py-2 rounded-lg"
                    :class="msg.senderId.toString() === currentUserId
                      ? 'bg-orange-500 text-white rounded-bl-lg'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-br-lg'"
                  >
                    <p class="text-sm">{{ msg.content }}</p>
                    <span class="absolute bottom-0 right-1 text-[10px] text-gray-500">
                      {{ formatTime(msg.sentAt) }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-gray-500 mt-10">
                채팅방을 생성하거나 선택해주세요.
              </div>
            </div>

            <div v-if="roomId" class="border-t border-gray-200 p-3 bg-white">
              <div class="flex">
                <input
                  v-model="inputMessage"
                  @keyup.enter="sendMessage()"
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  class="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  @click="sendMessage()"
                  class="ml-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// 헬퍼 함수: 숫자 앞에 0 붙이기 (예: 9 -> 09)
function zeroPad(num) {
  return num < 10 ? '0' + num : num;
}

export default {
  name: 'FloatingChatApp',

  // 1:1 채팅 상대 userId (선택 사항: 컴포넌트 로드 시 특정 상대와 채팅을 바로 시작할 때 사용)
  props: {
    otherUserId: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      isOpen: false, // 플로팅 채팅창 열림/닫힘 상태
      roomId: null, // 현재 활성화된 채팅방 ID
      stompClient: null, // STOMP 클라이언트 인스턴스
      messages: [], // 현재 방의 메시지 배열
      inputMessage: '', // 메시지 입력 필드 텍스트
      currentUserId: null, // 현재 로그인한 사용자 ID
      jwtToken: null, // JWT 토큰 (인증용)
      chatRooms: [], // 모든 채팅방 목록 (백엔드에서 가져옴)
      selectedChatRoomId: null // UI에서 선택된 채팅방 ID
    };
  },

  created() {
    // 1) JWT 토큰 확인 및 현재 사용자 ID 설정
    this.jwtToken = localStorage.getItem('accessToken') || '';
    if (!this.jwtToken) {
      alert('로그인 정보가 없습니다. 로그인 후 다시 시도해주세요.');
      if (this.$router) {
        this.$router.push({ name: 'login' });
      } else {
        window.location.href = '/login'; // Vue Router를 사용하지 않는 경우
      }
      return;
    }

    // JWT 페이로드에서 userId 추출 (백엔드 Principal.getName()이 userId를 반환하므로 일관성 유지)
    try {
      const payload = JSON.parse(atob(this.jwtToken.split('.')[1]));
      this.currentUserId = payload.sub; // 일반적으로 'sub' (subject) 필드에 사용자 ID가 있음
      localStorage.setItem('userId', this.currentUserId); // 로컬스토리지에 저장 (편의상)
    } catch (e) {
      console.error('JWT 토큰 파싱 오류:', e);
      alert('유효하지 않은 로그인 정보입니다. 다시 로그인해주세요.');
      if (this.$router) {
        this.$router.push({ name: 'login' });
      } else {
        window.location.href = '/login';
      }
      return;
    }

    // 컴포넌트 생성 시, 현재 사용자의 모든 채팅방 목록을 불러옵니다.
    this.fetchChatRooms();
  },

  computed: {
    // 현재 선택된 채팅방 객체를 반환합니다.
    selectedChatRoom() {
      return this.chatRooms.find(room => room.id === this.selectedChatRoomId);
    }
  },

  methods: {
    // 헬퍼 함수들을 methods로 노출
    zeroPad,

    // 시간 포맷팅 헬퍼: "HH:mm"
    formatTime(isoString) {
      if (!isoString) return '';
      const d = new Date(isoString);
      const hh = zeroPad(d.getHours());
      const mm = zeroPad(d.getMinutes());
      return `${hh}:${mm}`;
    },

    // 메시지 발신자 ID를 기반으로 상대방 이름 또는 "나"를 반환
    getOtherUserName(senderId) {
      if (senderId.toString() === this.currentUserId) {
        return '나';
      }
      // 현재 선택된 채팅방의 정보를 사용하여 상대방 이름을 찾습니다.
      if (this.selectedChatRoom) {
        const otherParticipantId =
          this.selectedChatRoom.user1Id.toString() === this.currentUserId
            ? this.selectedChatRoom.user2Id
            : this.selectedChatRoom.user1Id;
        if (senderId.toString() === otherParticipantId.toString()) {
          return `User ${otherParticipantId}`; // 예시: 상대방 ID를 이름으로 사용
        }
      }
      return '알 수 없음';
    },

    // ────────────────────────────────────────────────────────
    // API 호출 및 WebSocket 관리 메서드
    // ────────────────────────────────────────────────────────

    // 모든 채팅방 목록을 백엔드에서 가져옵니다.
    async fetchChatRooms() {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      try {
        const response = await axios.get(`${baseUrl}/chat/rooms`, {
          headers: { Authorization: `Bearer ${this.jwtToken}` }
        });
        // 백엔드에서 받은 ChatRoomListDto 목록을 chatRooms 배열에 저장
        this.chatRooms = response.data.map(room => ({
          id: room.roomId,
          // 채팅방 이름은 현재 사용자가 아닌 다른 참여자의 ID를 기반으로 생성
          name: room.user1Id.toString() === this.currentUserId ? `User ${room.user2Id}` : `User ${room.user1Id}`,
          lastMessage: room.lastMessageContent || '새 메시지 없음',
          user1Id: room.user1Id,
          user2Id: room.user2Id
        }));

        // 만약 initial otherUserId prop이 있다면, 해당 방을 자동으로 선택
        if (this.otherUserId && this.chatRooms.length > 0) {
          const initialRoom = this.chatRooms.find(room =>
            (room.user1Id.toString() === this.currentUserId && room.user2Id.toString() === this.otherUserId) ||
            (room.user1Id.toString() === this.otherUserId && room.user2Id.toString() === this.currentUserId)
          );
          if (initialRoom) {
            this.selectChatRoom(initialRoom.id);
          } else {
            // 해당 otherUserId와의 채팅방이 없으면 새로 생성
            this.createOrEnterRoom(this.otherUserId);
          }
        } else if (this.chatRooms.length > 0) {
          // otherUserId prop이 없거나 해당 방이 없으면 첫 번째 채팅방 자동 선택
          this.selectChatRoom(this.chatRooms[0].id);
        }
      } catch (err) {
        console.error('채팅방 목록을 가져오는 중 오류 발생:', err);
        alert('채팅방 목록을 불러오지 못했습니다.');
      }
    },

    // 특정 `otherUserId`와 1:1 채팅방 생성 또는 기존 방 조회
    async createOrEnterRoom(otherUserId) {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      try {
        const res = await axios.post(
          `${baseUrl}/chat/room?otherUserId=${otherUserId}`,
          {},
          { headers: { Authorization: `Bearer ${this.jwtToken}` } }
        );
        const newRoom = res.data; // { roomId, user1Id, user2Id }

        // 이미 chatRooms에 있는 방인지 확인 후 없으면 추가
        const existingRoomIndex = this.chatRooms.findIndex(room => room.id === newRoom.roomId);
        if (existingRoomIndex === -1) {
          // 새 방이라면 목록에 추가
          this.chatRooms.push({
            id: newRoom.roomId,
            name: newRoom.user1Id.toString() === this.currentUserId ? `User ${newRoom.user2Id}` : `User ${newRoom.user1Id}`,
            lastMessage: '새로운 채팅방',
            user1Id: newRoom.user1Id,
            user2Id: newRoom.user2Id
          });
        }
        this.selectChatRoom(newRoom.roomId); // 새로 생성/조회된 방 선택
      } catch (err) {
        console.error('채팅방 생성/조회 오류:', err);
        alert('채팅방을 불러오는 중 오류가 발생했습니다.');
        this.isOpen = false;
      }
    },

    // 채팅방 선택 시 호출되는 로직
    async selectChatRoom(roomId) {
      if (this.selectedChatRoomId === roomId && this.stompClient && this.stompClient.connected) {
        // 이미 선택된 방이고 웹소켓이 연결되어 있다면 아무것도 하지 않습니다.
        return;
      }

      this.selectedChatRoomId = roomId;
      this.roomId = roomId; // 현재 활성화된 방 ID 업데이트
      this.messages = []; // 메시지 초기화
      this.disconnectWebSocket(); // 이전 웹소켓 연결 해제 (새 방 선택 시 필수)

      await this.loadOldMessages(); // 과거 메시지 로드
      this.connectWebSocket(); // 새 웹소켓 연결
      this.isOpen = true; // 채팅창 열기
    },

    // 특정 방의 과거 메시지를 불러옵니다.
    async loadOldMessages() {
      if (!this.roomId) return;
      const baseUrl = import.meta.env.VITE_API_URL || '';
      try {
        const res = await axios.get(`${baseUrl}/chat/room/${this.roomId}/messages`, {
          headers: { Authorization: `Bearer ${this.jwtToken}` }
        });
        this.messages = res.data;
        this.scrollToBottom();
      } catch (err) {
        console.error('과거 메시지 로드 오류:', err);
      }
    },

    // STOMP(WebSocket) 연결을 설정하고, 현재 방을 구독합니다.
    connectWebSocket() {
      if (this.stompClient && this.stompClient.connected) {
        // 이미 연결되어 있으면 다시 연결하지 않음
        return;
      }

      let baseUrl = import.meta.env.VITE_API_URL || '';
      baseUrl = baseUrl.replace(/\/api\/v1$/, ''); // "/api/v1" 부분을 제거하여 호스트:포트만 얻음

      const socket = new SockJS(`${baseUrl}/ws-stomp`);
      this.stompClient = Stomp.over(socket);
      this.stompClient.debug = null; // Stompjs의 디버그 메시지 비활성화 (선택 사항)

      this.stompClient.connect(
        { Authorization: `Bearer ${this.jwtToken}` }, // JWT 토큰을 CONNECT 헤더에 포함
        () => {
          console.log(`WebSocket 연결 성공! Room ID: ${this.roomId}`);
          // 해당 채팅방을 구독하여 실시간 메시지를 받습니다.
          this.stompClient.subscribe(`/sub/chat/room/${this.roomId}`, (frame) => {
            const body = JSON.parse(frame.body);
            this.messages.push(body);
            // 해당 채팅방의 lastMessage 및 lastMessageSentAt 업데이트
            const currentRoom = this.chatRooms.find(room => room.id === this.roomId);
            if (currentRoom) {
                currentRoom.lastMessage = body.content;
                // currentRoom.lastMessageSentAt = body.sentAt; // 필요하다면 추가
            }
            this.scrollToBottom();
          });
        },
        (error) => {
          console.error('WebSocket 연결 실패:', error);
          alert('채팅 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
      );
    },

    // STOMP(WebSocket) 연결을 해제합니다.
    disconnectWebSocket() {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.disconnect(() => {
          console.log('STOMP 연결 해제됨');
          this.stompClient = null;
        });
      }
    },

    // 메시지를 전송합니다.
    sendMessage() {
      const text = this.inputMessage.trim();
      if (!text || !this.roomId || !this.stompClient || !this.stompClient.connected) {
        console.warn('메시지를 보낼 수 없습니다. 조건 미충족:', { text, roomId: this.roomId, connected: this.stompClient?.connected });
        return;
      }

      // ChatMessageDto 구조에 맞춰 payload 생성
      const payload = {
        messageId: null,
        roomId: this.roomId,
        senderId: null, // 서버에서 Principal을 통해 채워줌
        content: text,
        sentAt: null // 서버에서 시간 정보를 설정해 줌
      };

      // STOMP send: 백엔드 @MessageMapping("/sendMessage") 호출
      this.stompClient.send('/pub/sendMessage', {}, JSON.stringify(payload));
      this.inputMessage = '';
    },

    // 메시지 영역을 스크롤 맨 아래로 이동시키는 헬퍼
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    // 플로팅 버튼 클릭 시 채팅창 열기/닫기 토글
    toggleChat() {
      // 로그인되어 있지 않으면 버튼이 비활성화되므로 이 로직은 불필요하지만, 혹시 모를 상황에 대비
      if (!this.currentUserId) return;

      if (this.isOpen) {
        // 창이 열려 있을 때 닫으면, 웹소켓 연결 해제 및 상태 초기화
        this.isOpen = false;
        this.disconnectWebSocket();
        this.selectedChatRoomId = null; // 선택된 채팅방 초기화
        this.roomId = null; // 활성화된 방 ID도 초기화
        this.messages = []; // 메시지 목록도 초기화
      } else {
        // 창이 닫혀 있을 때 열면
        if (this.chatRooms.length === 0) {
            // 채팅방 목록이 없으면 새로 불러옵니다.
            this.fetchChatRooms(); // fetchChatRooms에서 첫 방 선택/생성 및 웹소켓 연결까지 처리
        } else if (!this.selectedChatRoomId && this.chatRooms.length > 0) {
            // 목록은 있는데 선택된 방이 없으면 첫 번째 방을 선택
            this.selectChatRoom(this.chatRooms[0].id);
        } else if (this.selectedChatRoomId) {
            // 이미 선택된 방이 있으면 해당 방 메시지 로드 및 웹소켓 연결 재개
            this.loadOldMessages();
            this.connectWebSocket();
        }
        this.isOpen = true; // 채팅창 열기
      }
    },

    // "새 채팅방 만들기" 버튼 클릭 시
    openCreateRoomPrompt() {
      const targetUserId = prompt("채팅을 시작할 상대방의 ID를 입력하세요:");
      if (targetUserId) {
        // 입력받은 ID가 현재 사용자의 ID와 같으면 경고
        if (targetUserId === this.currentUserId) {
          alert("자기 자신과는 채팅할 수 없습니다.");
          return;
        }

        // 입력받은 ID가 숫자인지 확인 (선택 사항이지만 좋은 방어 코드)
        if (isNaN(targetUserId) || parseInt(targetUserId) <= 0) {
            alert("유효한 사용자 ID를 입력해주세요 (숫자).");
            return;
        }

        // 이미 해당 상대방과의 채팅방이 있는지 확인
        const existingRoom = this.chatRooms.find(room =>
          (room.user1Id.toString() === this.currentUserId && room.user2Id.toString() === targetUserId) ||
          (room.user1Id.toString() === targetUserId && room.user2Id.toString() === this.currentUserId)
        );

        if (existingRoom) {
          // 이미 방이 있으면 그 방을 선택
          alert("이미 존재하는 채팅방입니다. 해당 채팅방으로 이동합니다.");
          this.selectChatRoom(existingRoom.id);
        } else {
          // 없으면 새로운 방 생성
          this.createOrEnterRoom(targetUserId);
        }
      }
    }
  },

  beforeUnmount() {
    // 컴포넌트가 사라질 때 WebSocket 연결 해제
    this.disconnectWebSocket();
  }
};
</script>

<style scoped>
/* Transition 애니메이션을 위한 CSS */
.chat-slide-fade-enter-active,
.chat-slide-fade-leave-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.chat-slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.chat-slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>



