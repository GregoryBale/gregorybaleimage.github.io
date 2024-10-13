<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Ошибка в JSON']);
    exit;
}

if (!isset($data['prompt']) || !isset($data['rating'])) {
    echo json_encode(['success' => false, 'message' => 'Неверные данные']);
    exit;
}

$prompt = $data['prompt'];
$rating = $data['rating'];

// Функция для отправки сообщения в Telegram бот
function sendToTelegramBot($message) {
    $botToken = '8188305492:AAEKAaKHyAF7k0cksR4wKet1gYsBRTy7yJU';
    $chatId = '8188305492';
    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
    $data = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];

    $options = [
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query($data)
        ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    return $result !== false;
}

$message = "Новая оценка генерации:\n\n";
$message .= "Запрос: <code>" . htmlspecialchars($prompt) . "</code>\n";
$message .= "Оценка: " . ($rating === 'like' ? '👍' : '👎');

if (sendToTelegramBot($message)) {
    echo json_encode(['success' => true, 'message' => 'Оценка успешно отправлена']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при отправке оценки']);
}
?>