<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- 1) 플로팅 버튼: currentUserId가 없으면 비활성화 (로그인 여부) -->
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

    <!-- 2) 채팅창: isOpen이 true일 때만 보인다 -->
    <Transition name="chat-slide-fade">
      <div
        v-if="isOpen"
        class="fixed bottom-22 right-6 w-80 md:w-[600px] h-[80vh] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
      >
        <!-- 1. 헤더 -->
        <div class="bg-orange-500 text-white p-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">채팅</h3>
          <button @click="toggleChat" class="text-white hover:text-gray-200 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex flex-1 overflow-hidden">
          <!-- 왼쪽: 채팅방 목록 + 새 채팅방 만들기 버튼 -->
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
                <!-- 채팅방 이름 표시: managerName (companyName) -->
                <p class="font-semibold text-gray-800 truncate">{{ chatRoom.name }}</p>
                <p class="text-sm text-gray-500 truncate">{{ chatRoom.lastMessage }}</p>
              </div>
            </div>
          </div>

          <!-- 오른쪽: 1:1 채팅 메시지 영역 -->
          <div class="w-2/3 flex flex-col">
            <!-- 2. 메시지 목록 -->
            <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div v-if="roomId">
                <div
                  v-for="(msg, idx) in messages"
                  :key="idx"
                  class="mb-3 flex flex-col max-w-[70%]"
                  :class="msg.senderId.toString() === currentUserId ? 'ml-auto items-end' : 'mr-auto items-start'"
                >
                  <!-- 보낸 사람 표시 -->
                  <span class="text-xs text-gray-500 mb-1">
                    {{ msg.senderId.toString() === currentUserId ? '나' : getOtherUserName(msg.senderId) }}
                  </span>
                  <!-- 메시지 내용 -->
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

            <!-- 3. 메시지 입력 폼 -->
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

<script setup lang="ts"> // TypeScript 사용을 명시
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '@/api'; // apiClient 임포트
import { useAuthStore } from '@/states/auth'; // Pinia 인증 스토어 임포트
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// 헬퍼 함수: 숫자 앞에 0 붙이기 (예: 9 -> 09)
function zeroPad(num: number): string {
  return num < 10 ? '0' + num : String(num);
}

// 로컬 스토리지 키 정의
const CHAT_WINDOW_STATE_KEY = 'chatWindowState';

// Pinia 인증 스토어 사용
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Props 정의 (otherUserId는 이제 옵셔널)
interface Props {
  otherUserId?: string;
}
const props = defineProps<Props>();

// 컴포넌트 내부 상태 정의
const isOpen = ref<boolean>(localStorage.getItem(CHAT_WINDOW_STATE_KEY) === 'true'); // 로컬 스토리지에서 상태 불러오기
const roomId = ref<string | null>(null);
const stompClient = ref<Stomp.Client | null>(null);
const messages = ref<any[]>([]); // 백엔드 ChatMessageDto와 매칭
const inputMessage = ref<string>('');
const currentUserId = ref<string | null>(null); // Pinia 스토어에서 가져올 사용자 ID
const chatRooms = ref<any[]>([]); // 백엔드 ChatRoomListDto와 매칭
const selectedChatRoomId = ref<string | null>(null);

// 컴포넌트 마운트 시 초기화 로직
onMounted(() => {
  if (authStore.isLoggedIn && authStore.user && authStore.user.userId) {
    currentUserId.value = String(authStore.user.userId);
  } else {
    // 로그인되지 않았거나 사용자 정보가 없는 경우
    alert('로그인 정보가 없습니다. 로그인 후 다시 시도해주세요.');
    // 로그인 페이지로 리다이렉트
    router.push({ name: 'login' }); // router가 정의되어 있다고 가정
    return;
  }

  // 채팅창이 이전에 열려있었던 상태라면 채팅방 목록을 불러옵니다.
  if (isOpen.value) {
    fetchChatRooms();
  }
});

// 컴포넌트 언마운트 전에 상태 저장 및 웹소켓 연결 해제
onBeforeUnmount(() => {
  localStorage.setItem(CHAT_WINDOW_STATE_KEY, isOpen.value.toString()); // 최종 상태 저장
  disconnectWebSocket();
});

// Computed 속성
const selectedChatRoom = computed(() => {
  return chatRooms.value.find(room => room.id === selectedChatRoomId.value);
});

// 메서드 정의
const formatTime = (isoString: string): string => {
  if (!isoString) return '';
  const d = new Date(isoString);
  const hh = zeroPad(d.getHours());
  const mm = zeroPad(d.getMinutes());
  return `${hh}:${mm}`;
};

// 메시지 발신자 ID를 기반으로 상대방 이름 또는 "나"를 반환
const getOtherUserName = (senderId: number): string => { // senderId는 백엔드에서 Long이므로 number로 받음
  if (senderId.toString() === currentUserId.value) {
    return '나';
  }
  if (selectedChatRoom.value) {
    // 현재 선택된 채팅방의 user1 또는 user2 ParticipantDto에서 managerName을 찾습니다.
    const participant = [selectedChatRoom.value.user1, selectedChatRoom.value.user2]
      .find((p: any) => p.userId.toString() === senderId.toString());

    if (participant) {
      return participant.managerName; // 상대방의 managerName 반환
    }
  }
  return `User ${senderId}`; // 찾지 못하면 기본값
};

// 모든 채팅방 목록을 백엔드에서 가져옵니다.
async function fetchChatRooms(): Promise<void> {
  try {
    const response = await apiClient.get('/chat/rooms');
    // 백엔드 ChatRoomListDto: { roomId, user1: ParticipantDto, user2: ParticipantDto, lastMessageContent, lastMessageSentAt }
    chatRooms.value = response.data.map((room: any) => {
      // '나'와 '상대방'의 ParticipantDto를 구분합니다.
      const other = room.user1.userId.toString() === currentUserId.value ? room.user2 : room.user1;

      return {
        id: room.roomId,
        // 채팅방 목록에 표시될 이름: "managerName (companyName)" 형식
        name: `${other.managerName} ${other.companyName ? `(${other.companyName})` : ''}`,
        lastMessage: room.lastMessageContent || '새 메시지 없음',
        user1: room.user1, // ParticipantDto 전체 저장
        user2: room.user2, // ParticipantDto 전체 저장
      };
    });

    // otherUserId prop이 있다면 해당 방을 우선적으로 선택
    if (props.otherUserId && chatRooms.value.length > 0) {
      const initialRoom = chatRooms.value.find(room =>
        (room.user1.userId.toString() === currentUserId.value && room.user2.userId.toString() === props.otherUserId) ||
        (room.user1.userId.toString() === props.otherUserId && room.user2.userId.toString() === currentUserId.value)
      );
      if (initialRoom) {
        selectChatRoom(initialRoom.id);
      } else {
        // 해당 otherUserId와의 채팅방이 없으면 새로 생성
        createOrEnterRoom(props.otherUserId);
      }
    } else if (chatRooms.value.length > 0) {
      // otherUserId prop이 없거나 해당 방이 없으면 첫 번째 채팅방 자동 선택
      selectChatRoom(chatRooms.value[0].id);
    }
  } catch (error: any) {
    console.error('채팅방 목록을 가져오는 중 오류 발생:', error);
    alert('채팅방 목록을 불러오지 못했습니다.');
    isOpen.value = false; // 오류 발생 시 채팅창 닫기
    localStorage.setItem(CHAT_WINDOW_STATE_KEY, 'false');
  }
}

// 특정 `otherUserId`와 1:1 채팅방 생성 또는 기존 방 조회
async function createOrEnterRoom(otherUserId: string): Promise<void> {
  try {
    const response = await apiClient.post(`/chat/room?otherUserId=${otherUserId}`);
    const newRoom = response.data; // { roomId, user1Id, user2Id }

    // 새로운 방이 생성/조회되면 전체 채팅방 목록을 새로고침하여 ParticipantDto 정보를 가져옵니다.
    await fetchChatRooms();

    // 새로고침된 목록에서 해당 방을 찾아 선택합니다.
    selectChatRoom(newRoom.roomId);
  } catch (error: any) {
    console.error('채팅방 생성/조회 오류:', error);
    alert('채팅방을 불러오는 중 오류가 발생했습니다.');
    isOpen.value = false;
    localStorage.setItem(CHAT_WINDOW_STATE_KEY, 'false');
  }
}

// 채팅방 선택 시 호출되는 로직
async function selectChatRoom(id: string): Promise<void> {
  if (selectedChatRoomId.value === id && stompClient.value && stompClient.value.connected) {
    return; // 이미 선택된 방이고 웹소켓이 연결되어 있다면 아무것도 하지 않음
  }

  selectedChatRoomId.value = id;
  roomId.value = id; // 현재 활성화된 방 ID 업데이트
  messages.value = []; // 메시지 초기화
  disconnectWebSocket(); // 이전 웹소켓 연결 해제 (새 방 선택 시 필수)

  await loadOldMessages(); // 과거 메시지 로드
  connectWebSocket(); // 새 웹소켓 연결

  isOpen.value = true; // 방 선택 시 채팅창 열림
  localStorage.setItem(CHAT_WINDOW_STATE_KEY, 'true'); // 상태 저장
}

// 특정 방의 과거 메시지를 불러옵니다.
async function loadOldMessages(): Promise<void> {
  if (!roomId.value) return;
  try {
    const response = await apiClient.get(`/chat/room/${roomId.value}/messages`);
    messages.value = response.data;
    scrollToBottom();
  } catch (error: any) {
    console.error('과거 메시지 로드 오류:', error);
  }
}

// STOMP(WebSocket) 연결을 설정하고, 현재 방을 구독합니다.
function connectWebSocket(): void {
  if (stompClient.value && stompClient.value.connected) {
    return; // 이미 연결되어 있으면 다시 연결하지 않음
  }

  // Pinia 스토어에서 현재 accessToken 가져오기 (WebSocket CONNECT 헤더용)
  const currentAccessToken = authStore.accessToken;
  if (!currentAccessToken) {
    console.error('WebSocket 연결 실패: accessToken이 없습니다.');
    alert('인증 정보가 만료되었습니다. 다시 로그인해주세요.');
    router.push({ name: 'login' }); // 로그인 페이지로 리다이렉트
    return;
  }

  let baseUrl = import.meta.env.VITE_API_URL || '';
  baseUrl = baseUrl.replace(/\/api\/v1$/, ''); // "/api/v1" 부분을 제거하여 호스트:포트만 얻음

  const socket = new SockJS(`${baseUrl}/ws-stomp`);
  stompClient.value = Stomp.over(socket);
  stompClient.value.debug = null; // Stompjs의 디버그 메시지 비활성화 (선택 사항)

  stompClient.value.connect(
    { Authorization: `Bearer ${currentAccessToken}` }, // JWT 토큰을 CONNECT 헤더에 포함
    () => {
      console.log(`WebSocket 연결 성공! Room ID: ${roomId.value}`);
      // 해당 채팅방을 구독하여 실시간 메시지를 받습니다.
      if (roomId.value) { // roomId가 null이 아님을 확인
        stompClient.value?.subscribe(`/sub/chat/room/${roomId.value}`, (frame: Stomp.Frame) => {
          const body = JSON.parse(frame.body);
          messages.value.push(body);
          const currentRoom = chatRooms.value.find(room => room.id === roomId.value);
          if (currentRoom) {
              currentRoom.lastMessage = body.content;
          }
          scrollToBottom();
        });
      }
    },
    (error: any) => {
      console.error('WebSocket 연결 실패:', error);
      alert('채팅 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
      isOpen.value = false; // WebSocket 연결 실패 시 채팅창 닫기
      localStorage.setItem(CHAT_WINDOW_STATE_KEY, 'false');
    }
  );
}

// STOMP(WebSocket) 연결을 해제합니다.
function disconnectWebSocket(): void {
  if (stompClient.value && stompClient.value.connected) {
    stompClient.value.disconnect(() => {
      console.log('STOMP 연결 해제됨');
      stompClient.value = null;
    });
  }
}

// 메시지를 전송합니다.
function sendMessage(): void {
  const text = inputMessage.value.trim();
  if (!text || !roomId.value || !stompClient.value || !stompClient.value.connected) {
    console.warn('메시지를 보낼 수 없습니다. 조건 미충족:', { text, roomId: roomId.value, connected: stompClient.value?.connected });
    return;
  }

  const payload = {
    messageId: null,
    roomId: roomId.value,
    senderId: null, // 서버에서 Principal을 통해 채워줌
    content: text,
    sentAt: null // 서버에서 시간 정보를 설정해 줌
  };

  stompClient.value.send('/pub/sendMessage', {}, JSON.stringify(payload));
  inputMessage.value = '';
}

// 메시지 영역을 스크롤 맨 아래로 이동시키는 헬퍼
function scrollToBottom(): void {
  nextTick(() => {
    const container = document.querySelector('.flex-1.p-4.overflow-y-auto') as HTMLElement; // ref 대신 querySelector 사용 시 타입 캐스팅
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
}

// 플로팅 버튼 클릭 시 채팅창 열기/닫기 토글
function toggleChat(): void {
  if (!currentUserId.value) return; // 로그인되지 않았으면 작동 안함

  isOpen.value = !isOpen.value; // 상태 변경
  localStorage.setItem(CHAT_WINDOW_STATE_KEY, isOpen.value.toString()); // 로컬 스토리지에 저장

  if (isOpen.value) {
    // 창이 열릴 때
    if (chatRooms.value.length === 0) {
        fetchChatRooms(); // 채팅방 목록이 없으면 새로 불러옴
    } else if (!selectedChatRoomId.value && chatRooms.value.length > 0) {
        selectChatRoom(chatRooms.value[0].id); // 목록은 있는데 선택된 방이 없으면 첫 번째 방 선택
    } else if (selectedChatRoomId.value) {
        loadOldMessages(); // 이미 선택된 방이 있으면 메시지 로드
        connectWebSocket(); // 웹소켓 연결 재개
    }
  } else {
    // 창이 닫힐 때
    disconnectWebSocket(); // 웹소켓 연결 해제
    selectedChatRoomId.value = null; // 선택된 채팅방 초기화
    roomId.value = null; // 활성화된 방 ID도 초기화
    messages.value = []; // 메시지 목록도 초기화
  }
}

// "새 채팅방 만들기" 버튼 클릭 시
function openCreateRoomPrompt(): void {
  const targetUserId = prompt("채팅을 시작할 상대방의 ID를 입력하세요:");
  if (targetUserId) {
    if (targetUserId === currentUserId.value) {
      alert("자기 자신과는 채팅할 수 없습니다.");
      return;
    }

    if (isNaN(Number(targetUserId)) || parseInt(targetUserId) <= 0) { // Number()로 변환 후 isNaN 체크
        alert("유효한 사용자 ID를 입력해주세요 (숫자).");
        return;
    }

    const existingRoom = chatRooms.value.find(room =>
      (room.user1.userId.toString() === currentUserId.value && room.user2.userId.toString() === targetUserId) ||
      (room.user1.userId.toString() === targetUserId && room.user2.userId.toString() === currentUserId.value)
    );

    if (existingRoom) {
      alert("이미 존재하는 채팅방입니다. 해당 채팅방으로 이동합니다.");
      selectChatRoom(existingRoom.id);
    } else {
      createOrEnterRoom(targetUserId);
    }
  }
}
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



