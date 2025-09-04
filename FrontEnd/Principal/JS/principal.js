// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {

    // ==================== FUNÇÃO DE NOTIFICAÇÃO ====================
    function showNotification(message, type = 'info') {
        const notificationCenter = document.querySelector('.notification-center');
        if (!notificationCenter) {
            console.error('Elemento .notification-center não encontrado no DOM.');
            return;
        }
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notificationCenter.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => notification.remove());
        }, 5000);
    }

    // ==================== VARIÁVEIS GLOBAIS ====================
    const currentUser = {
        id: 1,
        name: "Vinicius Gallo Santos",
        username: "Vinicius G.",
        avatar: "./img/perfil.png",
        title: "Estudante de ADS",
        connections: 11,
        projects: 2
    };

    // ==================== GERENCIAMENTO DE TEMA ====================
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    // ==================== MENU MOBILE ====================
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (window.innerWidth <= 768) {
        if (menuToggle) menuToggle.style.display = 'block';
        if (sidebar) sidebar.classList.add('mobile-hidden');
    }

    menuToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-hidden');
        menuToggle.innerHTML = sidebar.classList.contains('mobile-hidden') ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
    });
    
    // ==================== DROPDOWN DO USUÁRIO ====================
    const userDropdown = document.querySelector('.user-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    userDropdown?.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', () => {
        if (dropdownMenu) dropdownMenu.style.display = 'none';
    });

    // ==================== NOTIFICAÇÕES (MENU DROPDOWN) ====================
    const notificationIconContainer = document.querySelector('.nav-icon[data-tooltip="Notificações"]');
    const notificationMenu = document.getElementById('notification-menu');
    if (notificationIconContainer && notificationMenu) {
        notificationIconContainer.addEventListener('click', (event) => {
            event.stopPropagation();
            notificationMenu.classList.toggle('show');
        });
        document.addEventListener('click', (event) => {
            if (notificationMenu.classList.contains('show') && !notificationIconContainer.contains(event.target)) {
                notificationMenu.classList.remove('show');
            }
        });
    }

    // ==================== BARRA DE PESQUISA (COM CORREÇÃO DE ÍCONES SVG) ====================
    const searchInput = document.querySelector('.search input');
    const searchResults = document.querySelector('.search-results');

    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            searchResults.style.display = 'block';
            loadSearchResults(searchInput.value);
        });
        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                searchResults.style.display = 'none';
            }, 200);
        });
        searchInput.addEventListener('input', (e) => loadSearchResults(e.target.value));
    }
    
    function getIconByType(type) {
        const icons = {
            course: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V320c0-17.7-14.3-32-32-32V288c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32V192c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32V64c17.7 0 32-14.3 32-32S433.7 0 416 0H384 96zM256 352a96 96 0 1 1 0-192 96 96 0 1 1 0 192z"/></svg>',
            group: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM320 336a96 96 0 1 1 0 160 96 96 0 1 1 0-160z"/></svg>',
            user: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>',
            event: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192z"/></svg>'
        };
        return icons[type] || '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>';
    }

    function loadSearchResults(query = '') {
        const mockResults = [
            { id: 1, name: "Curso de Desenvolvimento Web", type: "course" },
            { id: 2, name: "Grupo de Projetos IoT", type: "group" },
            { id: 3, name: "Miguel Piscki", type: "user" },
            { id: 4, name: "Workshop de React", type: "event" }
        ];
        const filteredResults = mockResults.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        searchResults.innerHTML = filteredResults.map(result => `
            <div class="search-result" data-type="${result.type}" data-id="${result.id}">
                ${getIconByType(result.type)}
                <span>${result.name}</span>
            </div>
        `).join('');
        document.querySelectorAll('.search-result').forEach(result => {
            result.addEventListener('click', () => {
                showNotification(`Redirecionando para: ${result.querySelector('span').textContent}`);
                searchInput.value = '';
                searchResults.style.display = 'none';
            });
        });
    }

    // ==================== CRIAÇÃO DE POSTS ====================
    const postCreatorInput = document.querySelector('.post-creator input');
    const postOptions = document.querySelectorAll('.post-options .option-btn');
    const postsContainer = document.querySelector('.posts-container');

    if (postCreatorInput) {
        postCreatorInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && postCreatorInput.value.trim()) {
                createPost(postCreatorInput.value.trim());
                postCreatorInput.value = '';
            }
        });
    }
    
    if (postOptions) {
        postOptions.forEach(option => {
            option.addEventListener('click', () => {
                const type = option.dataset.type;
                showNotification(`Adicionar ${type === 'photo' ? 'imagem' : type === 'video' ? 'vídeo' : 'código'}`);
            });
        });
    }

    function createPost(content) {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.dataset.id = Date.now();
        postElement.dataset.authorName = currentUser.name; 
        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-author">
                    <div class="post-icon"><img src="${currentUser.avatar}" alt="${currentUser.name}"></div>
                    <div class="post-info">
                        <h2>${currentUser.name}</h2>
                        <span>agora • <i class="fas fa-globe-americas"></i></span>
                    </div>
                </div>
                <div class="post-options-btn"><i class="fas fa-ellipsis-h"></i></div>
            </div>
            <div class="post-text">${content}</div>
            <div class="post-actions">
                <button class="like-btn"><i class="far fa-thumbs-up"></i> <span>Curtir</span> <span class="count">0</span></button>
                <button class="comment-btn"><i class="far fa-comment"></i> <span>Comentar</span> <span class="count">0</span></button>
                <button class="share-btn"><i class="far fa-share-square"></i> <span>Compartilhar</span></button>
            </div>
            <div class="post-comments"></div>
            <div class="add-comment">
                <div class="avatar-small"><img src="${currentUser.avatar}" alt="${currentUser.name}"></div>
                <input type="text" placeholder="Adicione um comentário...">
            </div>`;
        addPostEvents(postElement);
        postsContainer.prepend(postElement);
    }

    // ==================== INTERAÇÕES COM POSTS ====================
    function addPostEvents(postElement) {
        const optionsBtn = postElement.querySelector('.post-options-btn');
        optionsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPostOptionsMenu(postElement, e.currentTarget);
        });

        const likeBtn = postElement.querySelector('.like-btn');
        likeBtn.addEventListener('click', () => {
            likeBtn.classList.toggle('liked');
            const icon = likeBtn.querySelector('i');
            const count = likeBtn.querySelector('.count');
            const isLiked = likeBtn.classList.contains('liked');
            icon.className = isLiked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up';
            count.textContent = parseInt(count.textContent) + (isLiked ? 1 : -1);
        });

        const commentInput = postElement.querySelector('.add-comment input');
        commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && commentInput.value.trim()) {
                addComment(postElement, commentInput.value.trim());
                commentInput.value = '';
            }
        });

        const shareBtn = postElement.querySelector('.share-btn');
        shareBtn.addEventListener('click', () => showNotification('Post compartilhado com sucesso!'));
    }

    function showPostOptionsMenu(postElement, targetButton) {
        document.querySelectorAll('.post-options-menu').forEach(menu => menu.remove());

        const menu = document.createElement('div');
        menu.className = 'post-options-menu';
        
        const isMyPost = postElement.dataset.authorName === currentUser.name;

        let menuHTML = `<button data-action="save"><i class="far fa-bookmark"></i> Salvar</button>`;
        if (isMyPost) {
            menuHTML += `
                <button data-action="edit"><i class="far fa-edit"></i> Editar</button>
                <button data-action="delete"><i class="far fa-trash-alt"></i> Excluir</button>
            `;
        }
        menu.innerHTML = menuHTML;

        document.body.appendChild(menu);

        const rect = targetButton.getBoundingClientRect();
        menu.style.top = `${rect.bottom + window.scrollY}px`;
        menu.style.right = `${window.innerWidth - rect.right}px`; 

        menu.addEventListener('click', (e) => {
            const action = e.target.closest('button').dataset.action;
            if (action === 'delete') {
                postElement.remove();
                showNotification('Post excluído com sucesso!');
            } else {
                showNotification('Funcionalidade ainda não implementada.');
            }
            menu.remove();
        });
        
        setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 10);
    }

    function addComment(postElement, content) {
        const commentsContainer = postElement.querySelector('.post-comments');
        const commentCount = postElement.querySelector('.comment-btn .count');
        const comment = document.createElement('div');
        comment.className = 'comment';
        comment.innerHTML = `
            <div class="avatar-small"><img src="${currentUser.avatar}" alt="${currentUser.name}"></div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${currentUser.name}</span>
                    <span class="comment-time">agora</span>
                </div>
                <p>${content}</p>
            </div>`;
        commentsContainer.appendChild(comment);
        commentCount.textContent = parseInt(commentCount.textContent) + 1;
    }

    // ==================== AMIGOS ONLINE ====================
    function loadOnlineFriends() {
        const onlineFriendsContainer = document.querySelector('.online-friends');
        if (!onlineFriendsContainer) return;
        onlineFriendsContainer.innerHTML = '';
        const mockFriends = [
            { id: 2, name: "Miguel Piscki", avatar: "https://randomuser.me/api/portraits/men/22.jpg", status: "online" },
            { id: 4, name: "Eliezer B.", avatar: "https://randomuser.me/api/portraits/men/45.jpg", status: "online" },
            { id: 5, name: "Julia Melo", avatar: "https://randomuser.me/api/portraits/women/48.jpg", status: "online" },
            { id: 6, name: "Carlos Lima", avatar: "https://randomuser.me/api/portraits/men/51.jpg", status: "away" },
            { id: 7, name: "Laura Costa", avatar: "https://randomuser.me/api/portraits/women/55.jpg", status: "online" },
        ];
        const friendsHTML = mockFriends.map(friend => `
            <div class="friend" data-id="${friend.id}" title="${friend.name}">
                <div class="friend-avatar ${friend.status}"><img src="${friend.avatar}" alt="${friend.name}"></div>
                <span>${friend.name.split(' ')[0]}</span>
            </div>`).join('');
        onlineFriendsContainer.innerHTML = `
            <div class="section-header">
                <h3><i class="fas fa-user-friends"></i> Colegas Online</h3>
                <a href="#" class="see-all">Ver todos</a>
            </div>
            <div class="friends-grid">${friendsHTML}</div>`;
        onlineFriendsContainer.querySelectorAll('.friend').forEach(friend => {
            friend.addEventListener('click', () => {
                showNotification(`Iniciando chat com ${friend.getAttribute('title')}`, 'info');
            });
        });
    }

    // ==================== WIDGETS ====================
    function loadAllWidgets() {
        const mockEventos = [
            { id: 5, titulo: "Semana da Cibersegurança", data: new Date(2025, 9, 9), formato: "Híbrido" },
            { id: 2, titulo: "Workshop de APIs com Node.js", data: new Date(2025, 9, 15), formato: "Online" },
            { id: 6, titulo: "Construindo seu Portfólio", data: new Date(2025, 10, 12), formato: "Online" }
        ];
        
        const mockProjetos = [
            { id: 101, titulo: "Irrigação Automatizada com IoT", autor: "Ana Silva", avatarAutor: "https://randomuser.me/api/portraits/women/33.jpg", imagem: "./img/irrigacao.jpg" },
            { id: 102, titulo: "Dashboard de Vendas em Power BI", autor: "Carlos Lima", avatarAutor: "https://randomuser.me/api/portraits/men/51.jpg", imagem: "./img/tiProjeto.png" }
        ];

        const eventsWidget = document.getElementById('upcoming-events-widget');
        if (eventsWidget) {
            const proximosEventos = mockEventos.filter(e => e.data >= new Date()).sort((a, b) => a.data - b.data).slice(0, 3);
            let eventsHTML = `<div class="widget-header"><h3><i class="fas fa-calendar-star"></i> Próximos Eventos</h3><a href="evento.html" class="see-all">Ver todos</a></div><div class="events-preview-list">`;
            if (proximosEventos.length) {
                proximosEventos.forEach(evento => {
                    const dia = evento.data.getDate();
                    const mes = evento.data.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
                    eventsHTML += `<div class="event-preview-item"><div class="event-preview-date"><span>${dia}</span><span>${mes}</span></div><div class="event-preview-info"><h4>${evento.titulo}</h4><p><i class="fas fa-map-marker-alt"></i> ${evento.formato}</p></div></div>`;
                });
            } else {
                eventsHTML += '<p class="empty-message">Nenhum evento programado.</p>';
            }
            eventsWidget.innerHTML = eventsHTML + '</div>';
        }

        const projectsWidget = document.getElementById('featured-projects-widget');
        if (projectsWidget) {
            let projectsHTML = `<div class="widget-header"><h3><i class="fas fa-lightbulb"></i> Projetos em Destaque</h3><a href="projeto.html" class="see-all">Ver todos</a></div><div class="project-preview-list">`;
            mockProjetos.slice(0, 2).forEach(p => {
                projectsHTML += `<a href="#" class="project-preview-item" title="${p.titulo}"><div class="project-preview-image"><img src="${p.imagem}" alt="${p.titulo}"></div><div class="project-preview-info"><h4>${p.titulo}</h4><p><img src="${p.avatarAutor}" class="author-avatar" alt="${p.autor}"><span>Por ${p.autor}</span></p></div></a>`;
            });
            projectsWidget.innerHTML = projectsHTML + '</div>';
        }
    }

    // ==================== CARREGAR POSTS INICIAIS ====================
    function loadInitialPosts() {
        if (!postsContainer) return;
        const mockPosts = [
            // ✅ POST DO SENAI SÃO CARLOS NO TOPO
            { 
                id: 6, 
                author: { 
                    name: "Senai São Carlos", 
                    avatar: "./img/perfil.png"
                }, 
                content: "Bem-vindos à comunidade oficial do Senai São Carlos! Um espaço para conectar alunos, professores e empresas, compartilhar projetos e impulsionar carreiras. #SenaiSaoCarlos #Inovacao #Tecnologia", 
                images: [], 
                time: "1h", 
                likes: 58, 
                comments: [] 
            },
            { 
                id: 1, 
                author: { name: "Miguel Piscki", avatar: "https://randomuser.me/api/portraits/men/22.jpg" }, 
                content: "Finalizamos hoje o projeto de automação industrial usando Arduino e sensores IoT. O sistema monitora temperatura, umidade e controla atuadores remotamente!", 
                images: ["./img/unnamed.png"], 
                time: "Ontem", 
                likes: 24, 
                comments: [{ author: "Ana Silva", avatar: "https://randomuser.me/api/portraits/women/33.jpg", content: "Incrível, Miguel! Poderia compartilhar o código fonte?", time: "2h atrás" }] 
            },
            { 
                id: 2, 
                author: { name: "Eliezer Biancolini", avatar: "https://randomuser.me/api/portraits/men/45.jpg" }, 
                content: "Alguém interessado em formar um grupo de estudos para a maratona de programação? Estou pensando em reunir 3-5 pessoas para treinar 2x por semana.", 
                images: [], 
                time: "11h", 
                likes: 11, 
                comments: [] 
            },
            { 
                id: 3, 
                author: { name: "Gustavo Beltrame", avatar: "https://t4.ftcdn.net/jpg/02/24/86/95/360_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg" }, 
                content: "Desenvolvimento de um sistema que monitora o estoque em tempo real...", 
                images: ["./img/tiProjeto.png"], 
                time: "12d", 
                likes: 13, 
                comments: [] 
            },
            { 
                id: 4, 
                author: { name: "Ruth Azevedo", avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5tbMgjWv9P8gwFgrcjVgH7m8wqcTFOMpnXw&s" }, 
                content: "Preciso projetar um mecanismo de acionamento para um pequeno robô explorador terrestre...", 
                images: ["./img/robo.png"], 
                time: "20d", 
                likes: 30, 
                comments: [{ author: "Naiara Piscke", avatar: "https://img.freepik.com/fotos-gratis/retrato-de-mulher-feliz-com-tablet-digital_329181-11681.jpg?semt=ais_hybrid&w=740", content: "Este projeto tem um potencial incrível!" , time: "2h atrás" }] 
            },
            { 
                id: 5, 
                author: { name: "Lais Vitoria", avatar: "https://diariodocomercio.com.br/wp-content/uploads/2022/08/mulher-na-politica-eleicoes.jpg" }, 
                content: "Estou buscando colaboradores com experiência em mecatrônica e eletroeletrônica para um projeto inovador.", 
                images: [], 
                time: "21d", 
                likes: 22, 
                comments: [] 
            },
        ];
        postsContainer.innerHTML = '';
        mockPosts.forEach(postData => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.dataset.authorName = postData.author.name;
            postElement.innerHTML = `
                <div class="post-header"><div class="post-author"><div class="post-icon"><img src="${postData.author.avatar}" alt="${postData.author.name}"></div><div class="post-info"><h2>${postData.author.name}</h2><span>${postData.time} • <i class="fas fa-globe-americas"></i></span></div></div><div class="post-options-btn"><i class="fas fa-ellipsis-h"></i></div></div>
                <div class="post-text">${postData.content}</div>
                ${postData.images.length ? `<div class="post-images"><img src="${postData.images[0]}" alt="Post image"></div>` : ''}
                <div class="post-actions"><button class="like-btn"><i class="far fa-thumbs-up"></i> <span>Curtir</span> <span class="count">${postData.likes}</span></button><button class="comment-btn"><i class="far fa-comment"></i> <span>Comentar</span> <span class="count">${postData.comments.length}</span></button><button class="share-btn"><i class="far fa-share-square"></i> <span>Compartilhar</span></button></div>
                <div class="post-comments">${postData.comments.map(c => `<div class="comment"><div class="avatar-small"><img src="${c.avatar}" alt="${c.author}"></div><div class="comment-content"><div class="comment-header"><span class="comment-author">${c.author}</span><span class="comment-time">${c.time}</span></div><p>${c.content}</p></div></div>`).join('')}</div>
                <div class="add-comment"><div class="avatar-small"><img src="${currentUser.avatar}" alt="${currentUser.name}"></div><input type="text" placeholder="Adicione um comentário..."></div>`;
            postsContainer.appendChild(postElement);
            addPostEvents(postElement);
        });
    }

    // ==================== INICIALIZAÇÃO ====================
    function init() {
        loadOnlineFriends();
        loadAllWidgets();
        if (document.body.contains(document.querySelector('.posts-container'))) {
            loadInitialPosts();
        }
    }
    
    init();

    // ==================== RESPONSIVIDADE ====================
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            if (menuToggle) menuToggle.style.display = 'block';
        } else {
            if (menuToggle) menuToggle.style.display = 'none';
            if (sidebar) {
                sidebar.classList.remove('mobile-hidden');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});