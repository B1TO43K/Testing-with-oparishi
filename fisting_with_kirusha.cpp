#include <iostream>
#include <random>

int main() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1, 100);
    
    while (true) {
        int num = dis(gen);
        if (num == 42) {
            std::cout << "Кирюша любит фистинг!" << std::endl;
        }
        // Ничего не делаем с остальными числами
    }
    return 0;
}
